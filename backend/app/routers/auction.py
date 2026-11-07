from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
import datetime
from backend.app.database import get_db, SessionLocal
from backend.app.schemas import PlaceBidRequest, HostControlRequest
from backend.app.services.bidding_engine import bidding_manager
from backend.app.models import AuctionRoom

router = APIRouter(prefix="/auction", tags=["Live Auction Engine"])

@router.get("/{room_id}/state")
def get_live_state(room_id: str, db: Session = Depends(get_db)):
    bidding_manager.init_room_state_if_needed(room_id, db)
    return bidding_manager._get_client_state(room_id)

@router.post("/{room_id}/bid")
async def place_bid_endpoint(room_id: str, req: PlaceBidRequest):
    res = await bidding_manager.place_bid(
        room_id=room_id,
        team_id=req.team_id.upper(),
        username=req.username,
        custom_amount_lakh=req.bid_amount_lakh
    )
    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("error", "Bid failed."))
    return res

@router.post("/{room_id}/control")
async def host_control_endpoint(room_id: str, req: HostControlRequest, db: Session = Depends(get_db)):
    bidding_manager.init_room_state_if_needed(room_id, db)
    action = req.action.lower()

    if action == "start":
        await bidding_manager.start_auction(room_id)
        return {"success": True, "message": "Auction started."}
    elif action == "pause":
        bidding_manager.pause_auction(room_id)
        return {"success": True, "message": "Auction paused."}
    elif action == "resume":
        await bidding_manager.resume_auction(room_id)
        return {"success": True, "message": "Auction resumed."}
    elif action == "sold":
        await bidding_manager.force_sold(room_id)
        return {"success": True, "message": "Player hammered SOLD."}
    elif action == "unsold":
        await bidding_manager.force_unsold(room_id)
        return {"success": True, "message": "Player marked UNSOLD."}
    elif action == "next":
        await bidding_manager._advance_to_next_player(room_id)
        return {"success": True, "message": "Advanced to next player."}
    elif action == "reauction":
        if not req.param:
            raise HTTPException(status_code=400, detail="Player ID required for reauction.")
        await bidding_manager.reauction_player(room_id, req.param)
        return {"success": True, "message": f"Player {req.param} nominated for re-auction."}
    else:
        raise HTTPException(status_code=400, detail="Invalid host action.")

@router.websocket("/ws/{room_id}")
async def websocket_auction_endpoint(websocket: WebSocket, room_id: str):
    await bidding_manager.connect(room_id, websocket)
    
    # Initialize state in DB if not ready
    db = SessionLocal()
    try:
        bidding_manager.init_room_state_if_needed(room_id, db)
    finally:
        db.close()

    # Send initial state snapshot on connection
    await websocket.send_json({
        "type": "INITIAL_STATE",
        "state": bidding_manager._get_client_state(room_id)
    })

    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")

            if msg_type == "PLACE_BID":
                team_id = data.get("team_id")
                username = data.get("username", "Anonymous")
                custom_amount = data.get("bid_amount_lakh")
                res = await bidding_manager.place_bid(room_id, team_id, username, custom_amount)
                if not res.get("success"):
                    await websocket.send_json({
                        "type": "BID_ERROR",
                        "error": res.get("error")
                    })

            elif msg_type == "HOST_CONTROL":
                action = data.get("action", "").lower()
                param = data.get("param")
                if action == "start":
                    await bidding_manager.start_auction(room_id)
                elif action == "pause":
                    bidding_manager.pause_auction(room_id)
                elif action == "resume":
                    await bidding_manager.resume_auction(room_id)
                elif action == "sold":
                    await bidding_manager.force_sold(room_id)
                elif action == "unsold":
                    await bidding_manager.force_unsold(room_id)
                elif action == "next":
                    await bidding_manager._advance_to_next_player(room_id)
                elif action == "reauction" and param:
                    await bidding_manager.reauction_player(room_id, param)

            elif msg_type == "CHAT_MESSAGE":
                # Broadcast chat message to all room participants
                await bidding_manager.broadcast(room_id, {
                    "type": "CHAT_BROADCAST",
                    "username": data.get("username", "Participant"),
                    "team_id": data.get("team_id"),
                    "text": data.get("text", ""),
                    "timestamp": datetime.datetime.utcnow().strftime("%H:%M")
                })

    except WebSocketDisconnect:
        bidding_manager.disconnect(room_id, websocket)
    except Exception:
        bidding_manager.disconnect(room_id, websocket)

