import asyncio
import datetime
import random
from typing import Dict, Any, Optional, List
from fastapi import WebSocket
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal
from backend.app.models import (
    AuctionRoom, RoomParticipant, RoomTeamState, SquadMember, BidLog, Player, Team, Retention
)

def get_next_bid_amount(current_bid_lakh: int, base_price_lakh: int) -> int:
    """
    Computes official IPL increment steps:
    - First bid: base_price_lakh
    - Under 1 Cr (100L): +20L
    - 1 Cr to 5 Cr (100L - 500L): +25L
    - 5 Cr to 10 Cr (500L - 1000L): +50L
    - 10 Cr+ (>= 1000L): +100L
    """
    if current_bid_lakh <= 0:
        return base_price_lakh
    
    if current_bid_lakh < 100:
        increment = 20
    elif current_bid_lakh < 500:
        increment = 25
    elif current_bid_lakh < 1000:
        increment = 50
    else:
        increment = 100
        
    return current_bid_lakh + increment

class RoomConnectionManager:
    """Manages active WebSockets and live room auction states."""
    
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.room_states: Dict[str, Dict[str, Any]] = {}
        self.room_locks: Dict[str, asyncio.Lock] = {}
        self.timer_tasks: Dict[str, asyncio.Task] = {}

    def get_lock(self, room_id: str) -> asyncio.Lock:
        try:
            curr_loop = asyncio.get_running_loop()
        except RuntimeError:
            curr_loop = None

        lock = self.room_locks.get(room_id)
        if lock is None or getattr(lock, '_bound_loop', None) != curr_loop:
            lock = asyncio.Lock()
            lock._bound_loop = curr_loop
            self.room_locks[room_id] = lock
        return lock

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

    def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)

    async def broadcast(self, room_id: str, message: dict):
        if room_id in self.active_connections:
            dead_sockets = []
            for connection in self.active_connections[room_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    dead_sockets.append(connection)
            for dead in dead_sockets:
                self.disconnect(room_id, dead)

    def init_room_state_if_needed(self, room_id: str, db: Session) -> Dict[str, Any]:
        if room_id in self.room_states:
            return self.room_states[room_id]

        room = db.query(AuctionRoom).filter(AuctionRoom.id == room_id).first()
        if not room:
            return {}

        # Fetch players according to auction mode
        mode = room.auction_mode or "mega"
        query = db.query(Player)
        if mode == "mega":
            query = query.filter(Player.auction_mode.in_(["mega", "both"]))
        else:
            query = query.filter(Player.auction_mode.in_(["mini", "both"]))
        
        # Order by sets: M1, M2, BA1, AL1, WK1, FA1, SP1...
        players = query.all()
        # Sort by set order priority
        def set_rank(s):
            s = s.upper()
            if s.startswith("M"): return 0
            if s.startswith("BA"): return 1
            if s.startswith("AL"): return 2
            if s.startswith("WK"): return 3
            if s.startswith("FA"): return 4
            if s.startswith("SP"): return 5
            return 9
        players.sort(key=lambda p: (set_rank(p.auction_set), p.auction_set, -p.base_price_lakh))
        
        player_queue = [p.id for p in players]

        # Init team states if not already in DB
        existing_teams = db.query(RoomTeamState).filter(RoomTeamState.room_id == room_id).all()
        if not existing_teams:
            all_teams = db.query(Team).all()
            for t in all_teams:
                # If Mini Auction, calculate deducted retentions
                total_purse = t.default_purse_cr
                spent = 0.0
                sq_count = 0
                ov_count = 0
                
                if mode == "mini":
                    retentions = db.query(Retention).filter(Retention.team_id == t.id).all()
                    for r in retentions:
                        spent += r.retention_cost_cr
                        sq_count += 1
                        if r.country.strip().lower() != "india":
                            ov_count += 1
                        # Insert retained squad member
                        squad_m = SquadMember(
                            room_id=room_id,
                            team_id=t.id,
                            player_id=f"RET-{r.id}",
                            player_name=r.player_name,
                            role=r.role,
                            country=r.country,
                            is_overseas=(r.country.strip().lower() != "india"),
                            price_lakh=int(r.retention_cost_cr * 100),
                            price_cr=r.retention_cost_cr,
                            is_retained=True
                        )
                        db.add(squad_m)

                rem_purse = round(total_purse - spent, 2)
                rts = RoomTeamState(
                    room_id=room_id,
                    team_id=t.id,
                    total_purse_cr=total_purse,
                    spent_purse_cr=round(spent, 2),
                    remaining_purse_cr=rem_purse,
                    squad_count=sq_count,
                    overseas_count=ov_count
                )
                db.add(rts)
            db.commit()

        # Build initial state dictionary
        self.room_states[room_id] = {
            "room_id": room_id,
            "status": room.status or "waiting",
            "auction_mode": mode,
            "countdown": room.countdown_sec,
            "max_countdown": room.countdown_sec,
            "player_queue": player_queue,
            "player_index": room.current_player_index,
            "current_player": None,
            "current_bid_lakh": 0,
            "current_bid_cr": 0.0,
            "highest_bidder": None,
            "bid_history": [],
            "sold_players": [],
            "unsold_players": [],
            "is_timer_running": False,
            "enable_ai_bots": False  # Only enabled for demo rooms or when requested
        }

        # If a current player index is valid, set current player
        if player_queue and room.current_player_index < len(player_queue):
            pid = player_queue[room.current_player_index]
            p = db.query(Player).filter(Player.id == pid).first()
            if p:
                self.room_states[room_id]["current_player"] = {
                    "id": p.id,
                    "name": p.name,
                    "role": p.role,
                    "country": p.country,
                    "is_overseas": p.is_overseas,
                    "age": p.age,
                    "batting_style": p.batting_style,
                    "bowling_style": p.bowling_style,
                    "base_price_lakh": p.base_price_lakh,
                    "base_price_cr": p.base_price_cr,
                    "auction_category": p.auction_category,
                    "auction_set": p.auction_set,
                    "previous_teams": p.previous_teams,
                    "ipl_matches": p.ipl_matches,
                    "test_caps": p.test_caps,
                    "odi_caps": p.odi_caps,
                    "t20_caps": p.t20_caps,
                    "player_image": p.player_image,
                    "data_status": p.data_status
                }
                self.room_states[room_id]["current_bid_lakh"] = 0
                self.room_states[room_id]["current_bid_cr"] = 0.0

        return self.room_states[room_id]

    async def start_auction(self, room_id: str):
        state = self.room_states.get(room_id)
        if not state:
            return
        state["status"] = "active"
        state["countdown"] = state["max_countdown"]
        state["is_timer_running"] = True
        
        # Load first player if none loaded
        if not state["current_player"] and state["player_queue"]:
            await self._load_player_at_index(room_id, 0)

        # Broadcast state
        await self.broadcast(room_id, {
            "type": "AUCTION_STARTED",
            "state": self._get_client_state(room_id)
        })
        
        # Start countdown background loop
        self._restart_timer_loop(room_id)

    def pause_auction(self, room_id: str):
        state = self.room_states.get(room_id)
        if state:
            state["status"] = "paused"
            state["is_timer_running"] = False
            if room_id in self.timer_tasks:
                self.timer_tasks[room_id].cancel()

    async def resume_auction(self, room_id: str):
        state = self.room_states.get(room_id)
        if state:
            state["status"] = "active"
            state["is_timer_running"] = True
            await self.broadcast(room_id, {
                "type": "AUCTION_RESUMED",
                "state": self._get_client_state(room_id)
            })
            self._restart_timer_loop(room_id)

    async def place_bid(self, room_id: str, team_id: str, username: str, custom_amount_lakh: Optional[int] = None) -> Dict[str, Any]:
        print("--> Inside place_bid 1: acquiring lock", flush=True)
        async with self.get_lock(room_id):
            print("--> Inside place_bid 2: lock acquired", flush=True)
            state = self.room_states.get(room_id)
            if not state or state["status"] != "active":
                return {"success": False, "error": "Auction is not actively in progress."}

            curr_player = state.get("current_player")
            if not curr_player:
                return {"success": False, "error": "No player is currently on auction."}

            if state.get("highest_bidder") == team_id:
                return {"success": False, "error": f"{team_id} is already the highest bidder! You cannot outbid yourself."}

            # Calculate next valid bid
            curr_bid_lakh = state.get("current_bid_lakh", 0)
            base_lakh = curr_player.get("base_price_lakh", 30)
            next_min_lakh = get_next_bid_amount(curr_bid_lakh, base_lakh)
            bid_amount_lakh = custom_amount_lakh or next_min_lakh

            if bid_amount_lakh < next_min_lakh:
                return {"success": False, "error": f"Bid must be at least ₹{next_min_lakh} Lakh."}

            bid_amount_cr = round(bid_amount_lakh / 100.0, 2)

            # Check database team budget & limits
            db: Session = SessionLocal()
            try:
                team_state = db.query(RoomTeamState).filter(
                    RoomTeamState.room_id == room_id,
                    RoomTeamState.team_id == team_id
                ).first()

                if not team_state:
                    return {"success": False, "error": "Team state not found."}

                # 1. Budget check
                if team_state.remaining_purse_cr < bid_amount_cr:
                    return {
                        "success": False, 
                        "error": f"Insufficient purse! {team_id} has ₹{team_state.remaining_purse_cr} Cr, needs ₹{bid_amount_cr} Cr."
                    }

                # 2. Minimum squad reservation rule
                # Must have at least min_squad (18), with min 30L per unfilled spot
                remaining_slots_needed = max(0, 18 - (team_state.squad_count + 1))
                reserve_needed_cr = (remaining_slots_needed * 30) / 100.0
                purse_after_bid = team_state.remaining_purse_cr - bid_amount_cr
                if purse_after_bid < reserve_needed_cr:
                    return {
                        "success": False,
                        "error": f"Squad spend rule: Bidding ₹{bid_amount_cr} Cr leaves ₹{round(purse_after_bid, 2)} Cr, which is below the ₹{round(reserve_needed_cr, 2)} Cr required to fill the minimum 18-player squad."
                    }

                # 3. Squad size limit
                if team_state.squad_count >= 25:
                    return {"success": False, "error": f"{team_id} squad is full (25/25 players)."}

                # 4. Overseas limit
                if curr_player.get("is_overseas") and team_state.overseas_count >= 8:
                    return {"success": False, "error": f"{team_id} has already reached the maximum 8 overseas players limit."}

                # Bid is valid! Update state
                state["current_bid_lakh"] = bid_amount_lakh
                state["current_bid_cr"] = bid_amount_cr
                state["highest_bidder"] = team_id
                state["countdown"] = state["max_countdown"]  # Reset timer to 10s!

                bid_entry = {
                    "team_id": team_id,
                    "username": username,
                    "bid_amount_lakh": bid_amount_lakh,
                    "bid_amount_cr": bid_amount_cr,
                    "time": datetime.datetime.utcnow().strftime("%H:%M:%S")
                }
                state["bid_history"].insert(0, bid_entry)

                # Record bid in DB
                log = BidLog(
                    room_id=room_id,
                    player_id=curr_player["id"],
                    team_id=team_id,
                    username=username,
                    bid_amount_lakh=bid_amount_lakh,
                    bid_amount_cr=bid_amount_cr
                )
                db.add(log)
                db.commit()

            finally:
                db.close()

            # Broadcast valid bid event
            await self.broadcast(room_id, {
                "type": "NEW_BID",
                "bid": bid_entry,
                "current_bid_lakh": bid_amount_lakh,
                "current_bid_cr": bid_amount_cr,
                "highest_bidder": team_id,
                "countdown": state["countdown"],
                "next_min_bid_lakh": get_next_bid_amount(bid_amount_lakh, base_lakh)
            })

            # Check if AI bot should trigger a counter-bid in demo mode
            if state.get("enable_ai_bots"):
                asyncio.create_task(self._trigger_ai_counter_bid(room_id, team_id))

            return {"success": True, "bid": bid_entry}

    async def _trigger_ai_counter_bid(self, room_id: str, exclude_team: str):
        """Simulates realistic IPL franchise counter-bidding in demo / solo rooms."""
        await asyncio.sleep(random.uniform(2.0, 4.0))
        state = self.room_states.get(room_id)
        if not state or state["status"] != "active":
            return
        
        curr_player = state.get("current_player")
        if not curr_player or state.get("highest_bidder") != exclude_team:
            return

        # Cap bot bids realistically based on player marquee/base price
        base = curr_player.get("base_price_lakh", 30)
        curr = state.get("current_bid_lakh", 0)
        
        # Determine realistic ceiling for player
        if curr_player.get("auction_category") == "Marquee players":
            max_ceiling = base * random.randint(5, 12)  # up to 10 - 24 Cr
        elif curr_player.get("capped_status") == "Capped":
            max_ceiling = base * random.randint(2, 6)
        else:
            max_ceiling = base * random.randint(1, 4)

        if curr >= max_ceiling:
            return  # Bots pass

        # Choose a bot team other than exclude_team
        all_teams = ["CSK", "MI", "RCB", "KKR", "SRH", "RR", "DC", "PBKS", "GT", "LSG"]
        candidate_teams = [t for t in all_teams if t != exclude_team]
        random.shuffle(candidate_teams)

        db: Session = SessionLocal()
        try:
            chosen_team = None
            next_bid = get_next_bid_amount(curr, base)
            next_bid_cr = round(next_bid / 100.0, 2)
            
            for t in candidate_teams:
                ts = db.query(RoomTeamState).filter(
                    RoomTeamState.room_id == room_id,
                    RoomTeamState.team_id == t
                ).first()
                if ts and ts.remaining_purse_cr >= next_bid_cr + 5.0:
                    if curr_player.get("is_overseas") and ts.overseas_count >= 8:
                        continue
                    if ts.squad_count >= 25:
                        continue
                    chosen_team = t
                    break
        finally:
            db.close()

        if chosen_team:
            await self.place_bid(room_id, chosen_team, f"IPL Bot ({chosen_team})", next_bid)

    def _restart_timer_loop(self, room_id: str):
        if room_id in self.timer_tasks:
            self.timer_tasks[room_id].cancel()
        self.timer_tasks[room_id] = asyncio.create_task(self._countdown_loop(room_id))

    async def _countdown_loop(self, room_id: str):
        try:
            while True:
                await asyncio.sleep(1.0)
                state = self.room_states.get(room_id)
                if not state or state["status"] != "active":
                    break

                state["countdown"] -= 1
                
                # Broadcast TICK
                await self.broadcast(room_id, {
                    "type": "TIMER_TICK",
                    "countdown": state["countdown"]
                })

                if state["countdown"] <= 0:
                    # Timer expired! Resolve player
                    await self._resolve_current_player(room_id)
                    break
        except asyncio.CancelledError:
            pass

    async def _resolve_current_player(self, room_id: str):
        async with self.get_lock(room_id):
            state = self.room_states.get(room_id)
            if not state:
                return

            curr_player = state.get("current_player")
            if not curr_player:
                return

            highest_team = state.get("highest_bidder")
            winning_bid_lakh = state.get("current_bid_lakh", 0)
            winning_bid_cr = state.get("current_bid_cr", 0.0)

            db: Session = SessionLocal()
            try:
                if highest_team and winning_bid_lakh > 0:
                    # Player is SOLD!
                    # Deduct team purse & add squad member
                    team_state = db.query(RoomTeamState).filter(
                        RoomTeamState.room_id == room_id,
                        RoomTeamState.team_id == highest_team
                    ).first()

                    if team_state:
                        team_state.remaining_purse_cr = round(team_state.remaining_purse_cr - winning_bid_cr, 2)
                        team_state.spent_purse_cr = round(team_state.spent_purse_cr + winning_bid_cr, 2)
                        team_state.squad_count += 1
                        if curr_player.get("is_overseas"):
                            team_state.overseas_count += 1

                    squad_m = SquadMember(
                        room_id=room_id,
                        team_id=highest_team,
                        player_id=curr_player["id"],
                        player_name=curr_player["name"],
                        role=curr_player["role"],
                        country=curr_player["country"],
                        is_overseas=curr_player["is_overseas"],
                        price_lakh=winning_bid_lakh,
                        price_cr=winning_bid_cr,
                        is_retained=False
                    )
                    db.add(squad_m)
                    db.commit()

                    sold_record = {
                        "player": curr_player,
                        "team_id": highest_team,
                        "price_lakh": winning_bid_lakh,
                        "price_cr": winning_bid_cr,
                        "sold_at": datetime.datetime.utcnow().strftime("%H:%M:%S")
                    }
                    state["sold_players"].insert(0, sold_record)

                    # Broadcast SOLD event (triggers Gold fanfare & confetti in UI!)
                    await self.broadcast(room_id, {
                        "type": "PLAYER_SOLD",
                        "player": curr_player,
                        "team_id": highest_team,
                        "price_lakh": winning_bid_lakh,
                        "price_cr": winning_bid_cr,
                        "team_state": {
                            "team_id": highest_team,
                            "remaining_purse_cr": team_state.remaining_purse_cr if team_state else 0,
                            "squad_count": team_state.squad_count if team_state else 0,
                            "overseas_count": team_state.overseas_count if team_state else 0
                        }
                    })

                else:
                    # Player is UNSOLD!
                    state["unsold_players"].insert(0, curr_player)
                    await self.broadcast(room_id, {
                        "type": "PLAYER_UNSOLD",
                        "player": curr_player
                    })

            finally:
                db.close()

            # Wait 4 seconds for celebration, then advance to next player
            await asyncio.sleep(4.0)
            await self._advance_to_next_player(room_id)

    async def _advance_to_next_player(self, room_id: str):
        state = self.room_states.get(room_id)
        if not state:
            return

        next_idx = state["player_index"] + 1
        if next_idx < len(state["player_queue"]):
            await self._load_player_at_index(room_id, next_idx)
            state["status"] = "active"
            state["countdown"] = state["max_countdown"]
            
            await self.broadcast(room_id, {
                "type": "NEXT_PLAYER",
                "state": self._get_client_state(room_id)
            })
            self._restart_timer_loop(room_id)
        else:
            state["status"] = "completed"
            state["current_player"] = None
            await self.broadcast(room_id, {
                "type": "AUCTION_COMPLETED",
                "message": "All auction sets completed! Check the Final Results tab."
            })

    async def _load_player_at_index(self, room_id: str, index: int):
        state = self.room_states.get(room_id)
        if not state:
            return

        db: Session = SessionLocal()
        try:
            state["player_index"] = index
            pid = state["player_queue"][index]
            p = db.query(Player).filter(Player.id == pid).first()
            if p:
                state["current_player"] = {
                    "id": p.id,
                    "name": p.name,
                    "role": p.role,
                    "country": p.country,
                    "is_overseas": p.is_overseas,
                    "age": p.age,
                    "batting_style": p.batting_style,
                    "bowling_style": p.bowling_style,
                    "base_price_lakh": p.base_price_lakh,
                    "base_price_cr": p.base_price_cr,
                    "auction_category": p.auction_category,
                    "auction_set": p.auction_set,
                    "previous_teams": p.previous_teams,
                    "ipl_matches": p.ipl_matches,
                    "test_caps": p.test_caps,
                    "odi_caps": p.odi_caps,
                    "t20_caps": p.t20_caps,
                    "player_image": p.player_image,
                    "data_status": p.data_status
                }
                state["current_bid_lakh"] = 0
                state["current_bid_cr"] = 0.0
                state["highest_bidder"] = None
                state["bid_history"] = []
                state["countdown"] = state["max_countdown"]
        finally:
            db.close()

    async def force_sold(self, room_id: str):
        """Host instant gavel hammer hammer."""
        await self._resolve_current_player(room_id)

    async def force_unsold(self, room_id: str):
        """Host marks current player unsold."""
        state = self.room_states.get(room_id)
        if state:
            state["highest_bidder"] = None
            state["current_bid_lakh"] = 0
            state["current_bid_cr"] = 0.0
            await self._resolve_current_player(room_id)

    async def reauction_player(self, room_id: str, player_id: str):
        """Nominates an unsold player back into the queue."""
        state = self.room_states.get(room_id)
        if state:
            # Remove from unsold
            state["unsold_players"] = [p for p in state["unsold_players"] if p["id"] != player_id]
            # Insert at next position in queue
            state["player_queue"].insert(state["player_index"] + 1, player_id)
            await self.broadcast(room_id, {
                "type": "REAUCTION_NOMINATED",
                "player_id": player_id,
                "unsold_count": len(state["unsold_players"])
            })

    def _get_client_state(self, room_id: str) -> Dict[str, Any]:
        state = self.room_states.get(room_id, {})
        curr_p = state.get("current_player")
        base = curr_p.get("base_price_lakh", 30) if curr_p else 30
        curr_bid = state.get("current_bid_lakh", 0)

        # Get upcoming players (next 5)
        upcoming = []
        q = state.get("player_queue", [])
        idx = state.get("player_index", 0)
        
        db: Session = SessionLocal()
        try:
            for next_p_id in q[idx + 1: idx + 6]:
                p = db.query(Player).filter(Player.id == next_p_id).first()
                if p:
                    upcoming.append({
                        "id": p.id,
                        "name": p.name,
                        "role": p.role,
                        "country": p.country,
                        "base_price_lakh": p.base_price_lakh,
                        "auction_set": p.auction_set,
                        "is_overseas": p.is_overseas
                    })

            # Team states
            team_states = {}
            for ts in db.query(RoomTeamState).filter(RoomTeamState.room_id == room_id).all():
                team_states[ts.team_id] = {
                    "total_purse_cr": ts.total_purse_cr,
                    "spent_purse_cr": ts.spent_purse_cr,
                    "remaining_purse_cr": ts.remaining_purse_cr,
                    "squad_count": ts.squad_count,
                    "overseas_count": ts.overseas_count
                }
        finally:
            db.close()

        return {
            "room_id": room_id,
            "status": state.get("status", "waiting"),
            "auction_mode": state.get("auction_mode", "mega"),
            "countdown": state.get("countdown", 10),
            "max_countdown": state.get("max_countdown", 10),
            "current_player": curr_p,
            "current_bid_lakh": curr_bid,
            "current_bid_cr": state.get("current_bid_cr", 0.0),
            "next_min_bid_lakh": get_next_bid_amount(curr_bid, base),
            "highest_bidder": state.get("highest_bidder"),
            "bid_history": state.get("bid_history", []),
            "sold_players": state.get("sold_players", []),
            "unsold_players": state.get("unsold_players", []),
            "upcoming_players": upcoming,
            "total_players_in_pool": len(q),
            "current_player_index": idx,
            "team_states": team_states
        }

bidding_manager = RoomConnectionManager()
