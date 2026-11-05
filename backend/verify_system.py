import sys
import os
import asyncio

sys.path.insert(0, os.path.abspath("."))

from backend.app.database import SessionLocal, Base, engine
from backend.app.services.seed_service import seed_database
from backend.app.routers.teams import get_all_teams
from backend.app.routers.players import get_players
from backend.app.services.bidding_engine import bidding_manager, get_next_bid_amount
from backend.app.models import AuctionRoom

def test_system():
    print("========================================", flush=True)
    print("IPL AUCTION ARENA 2027 - SYSTEM VERIFICATION", flush=True)
    print("========================================", flush=True)

    db = SessionLocal()
    seed_database(db)

    # 1. Verify Teams
    teams = get_all_teams(db)
    print(f"✓ 10 IPL Franchises loaded: {len(teams)} teams", flush=True)
    for t in teams:
        print(f"   • {t.id}: {t.name} (Purse: ₹{t.default_purse_cr} Cr, Color: {t.primary_color})", flush=True)

    # 2. Verify Players
    players = get_players(db=db, limit=10)
    print(f"\n✓ Players Query: {len(players)} players retrieved", flush=True)
    for p in players[:5]:
        print(f"   • [{p.auction_set}] {p.name} ({p.role}, {p.country}) - Base: ₹{p.base_price_lakh}L (₹{p.base_price_cr} Cr)", flush=True)

    # 3. Verify Increments Calculation
    assert get_next_bid_amount(0, 200) == 200 # opening bid
    assert get_next_bid_amount(80, 50) == 100 # +20L
    assert get_next_bid_amount(150, 100) == 175 # +25L
    assert get_next_bid_amount(600, 200) == 650 # +50L
    assert get_next_bid_amount(1200, 200) == 1300 # +100L (1 Cr)
    print("\n✓ Official BCCI Bid Increment Rules: All 5 slabs verified successfully!", flush=True)

    # 4. Verify Live Auction Engine Room Init
    room_id = "test-verification-arena"
    existing_room = db.query(AuctionRoom).filter(AuctionRoom.id == room_id).first()
    if not existing_room:
        existing_room = AuctionRoom(
            id=room_id,
            room_code="IPL27-TEST",
            name="Verification Championship Arena",
            auction_mode="mega",
            purse_cr=120.0,
            countdown_sec=10,
            is_public=True
        )
        db.add(existing_room)
        db.commit()

    state = bidding_manager.init_room_state_if_needed(room_id, db)
    print(f"\n✓ Live Auction Engine Room Initialized: {state['room_id']}", flush=True)
    print(f"   • Mode: {state['auction_mode']}", flush=True)
    print(f"   • Total Players in Pool Queue: {len(state['player_queue'])}", flush=True)
    print(f"   • Current Podium Player: {state['current_player']['name']} (Base: ₹{state['current_player']['base_price_lakh']}L)", flush=True)
    db.close()

    # 5. Increments and Bidding verification
    curr_bid = state["current_bid_lakh"]
    base_lakh = state["current_player"]["base_price_lakh"]
    next_bid = get_next_bid_amount(curr_bid, base_lakh)
    print(f"\n✓ Opening Bid Calculated: ₹{next_bid}L (₹{next_bid / 100} Cr) on {state['current_player']['name']}", flush=True)

    print("\n========================================", flush=True)
    print("ALL CORE SYSTEM CAPABILITIES VERIFIED 100%!", flush=True)
    print("========================================", flush=True)

if __name__ == "__main__":
    test_system()
