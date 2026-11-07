import uuid
import random
import string
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models import AuctionRoom, RoomParticipant, RoomTeamState, Team
from backend.app.schemas import (
    RoomCreate, AuctionRoomOut, RoomParticipantOut, ClaimTeamRequest
)
from backend.app.services.bidding_engine import bidding_manager

router = APIRouter(prefix="/rooms", tags=["Auction Rooms"])

def generate_room_code() -> str:
    chars = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"IPL27-{chars}"

@router.post("/create", response_model=AuctionRoomOut)
def create_room(room_in: RoomCreate, db: Session = Depends(get_db)):
    room_id = str(uuid.uuid4())[:8]
    room_code = generate_room_code()
    
    new_room = AuctionRoom(
        id=room_id,
        room_code=room_code,
        name=room_in.name,
        auction_mode=room_in.auction_mode.lower(),
        purse_cr=room_in.purse_cr or 120.0,
        countdown_sec=room_in.countdown_sec or 10,
        is_public=room_in.is_public if room_in.is_public is not None else True,
        status="waiting"
    )
    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    # Initialize live state
    bidding_manager.init_room_state_if_needed(room_id, db)

    return AuctionRoomOut(
        id=new_room.id,
        room_code=new_room.room_code,
        name=new_room.name,
        host_user_id=new_room.host_user_id,
        auction_mode=new_room.auction_mode,
        purse_cr=new_room.purse_cr,
        countdown_sec=new_room.countdown_sec,
        is_public=new_room.is_public,
        status=new_room.status,
        current_player_index=new_room.current_player_index,
        current_player_id=new_room.current_player_id,
        current_bid_lakh=new_room.current_bid_lakh,
        current_bid_cr=new_room.current_bid_cr,
        highest_bidder_team_id=new_room.highest_bidder_team_id,
        created_at=new_room.created_at,
        participants_count=0
    )

@router.get("/public", response_model=List[AuctionRoomOut])
def get_public_rooms(db: Session = Depends(get_db)):
    rooms = db.query(AuctionRoom).filter(AuctionRoom.is_public == True).order_by(AuctionRoom.created_at.desc()).limit(20).all()
    results = []
    for r in rooms:
        p_count = db.query(RoomParticipant).filter(RoomParticipant.room_id == r.id).count()
        results.append(AuctionRoomOut(
            id=r.id,
            room_code=r.room_code,
            name=r.name,
            host_user_id=r.host_user_id,
            auction_mode=r.auction_mode,
            purse_cr=r.purse_cr,
            countdown_sec=r.countdown_sec,
            is_public=r.is_public,
            status=r.status,
            current_player_index=r.current_player_index,
            current_player_id=r.current_player_id,
            current_bid_lakh=r.current_bid_lakh,
            current_bid_cr=r.current_bid_cr,
            highest_bidder_team_id=r.highest_bidder_team_id,
            created_at=r.created_at,
            participants_count=p_count
        ))
    return results

@router.get("/code/{code}", response_model=AuctionRoomOut)
def get_room_by_code(code: str, db: Session = Depends(get_db)):
    room = db.query(AuctionRoom).filter(AuctionRoom.room_code == code.upper().strip()).first()
    if not room:
        raise HTTPException(status_code=404, detail="Auction room not found with this code.")
    p_count = db.query(RoomParticipant).filter(RoomParticipant.room_id == room.id).count()
    return AuctionRoomOut(
        id=room.id,
        room_code=room.room_code,
        name=room.name,
        host_user_id=room.host_user_id,
        auction_mode=room.auction_mode,
        purse_cr=room.purse_cr,
        countdown_sec=room.countdown_sec,
        is_public=room.is_public,
        status=room.status,
        current_player_index=room.current_player_index,
        current_player_id=room.current_player_id,
        current_bid_lakh=room.current_bid_lakh,
        current_bid_cr=room.current_bid_cr,
        highest_bidder_team_id=room.highest_bidder_team_id,
        created_at=room.created_at,
        participants_count=p_count
    )

@router.get("/{room_id}", response_model=AuctionRoomOut)
def get_room_detail(room_id: str, db: Session = Depends(get_db)):
    room = db.query(AuctionRoom).filter(AuctionRoom.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Auction room not found.")
    p_count = db.query(RoomParticipant).filter(RoomParticipant.room_id == room.id).count()
    return AuctionRoomOut(
        id=room.id,
        room_code=room.room_code,
        name=room.name,
        host_user_id=room.host_user_id,
        auction_mode=room.auction_mode,
        purse_cr=room.purse_cr,
        countdown_sec=room.countdown_sec,
        is_public=room.is_public,
        status=room.status,
        current_player_index=room.current_player_index,
        current_player_id=room.current_player_id,
        current_bid_lakh=room.current_bid_lakh,
        current_bid_cr=room.current_bid_cr,
        highest_bidder_team_id=room.highest_bidder_team_id,
        created_at=room.created_at,
        participants_count=p_count
    )

@router.get("/{room_id}/participants", response_model=List[RoomParticipantOut])
def get_participants(room_id: str, db: Session = Depends(get_db)):
    participants = db.query(RoomParticipant).filter(RoomParticipant.room_id == room_id).all()
    return [RoomParticipantOut.model_validate(p) for p in participants]

@router.post("/{room_id}/claim-team")
def claim_team(room_id: str, req: ClaimTeamRequest, db: Session = Depends(get_db)):
    room = db.query(AuctionRoom).filter(AuctionRoom.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found.")

    team = db.query(Team).filter(Team.id == req.team_id.upper()).first()
    if not team:
        raise HTTPException(status_code=400, detail="Invalid IPL team.")

    # Check if team is already claimed by someone else
    existing_claim = db.query(RoomParticipant).filter(
        RoomParticipant.room_id == room_id,
        RoomParticipant.claimed_team_id == team.id
    ).first()

    if existing_claim and existing_claim.username != req.username:
        raise HTTPException(
            status_code=400, 
            detail=f"{team.name} ({team.id}) is already claimed by {existing_claim.username}!"
        )

    # Find or create participant
    participant = db.query(RoomParticipant).filter(
        RoomParticipant.room_id == room_id,
        RoomParticipant.username == req.username
    ).first()

    if not participant:
        participant = RoomParticipant(
            room_id=room_id,
            username=req.username,
            claimed_team_id=team.id,
            is_host=(db.query(RoomParticipant).filter(RoomParticipant.room_id == room_id).count() == 0),
            is_spectator=False
        )
        db.add(participant)
    else:
        participant.claimed_team_id = team.id
        participant.is_spectator = False

    db.commit()
    db.refresh(participant)
    return {"success": True, "claimed_team_id": team.id, "username": req.username}

