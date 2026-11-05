from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from backend.app.database import get_db
from backend.app.models import Player, Season, Retention, Team, AuctionRoom, RoomParticipant, RoomTeamState, SquadMember, BidLog
from backend.app.services.csv_service import validate_and_parse_player_csv
from backend.app.services.seed_service import seed_database
from backend.app.services.bidding_engine import bidding_manager

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.post("/import-csv")
async def import_players_csv(
    file: UploadFile = File(...),
    mode: str = "mega",
    db: Session = Depends(get_db)
):
    content_bytes = await file.read()
    try:
        content_str = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        content_str = content_bytes.decode("latin-1")

    is_valid, parsed_players, errors = validate_and_parse_player_csv(content_str)
    if not is_valid:
        return {
            "success": False,
            "errors": errors,
            "imported_count": 0
        }

    imported_count = 0
    for p in parsed_players:
        # Check if player exists by name
        existing = db.query(Player).filter(Player.name == p["name"]).first()
        if existing:
            existing.base_price_lakh = p["base_price_lakh"]
            existing.base_price_cr = p["base_price_cr"]
            existing.role = p["role"]
            existing.country = p["country"]
            existing.auction_set = p["auction_set"]
            existing.auction_category = p["auction_category"]
            existing.data_status = "Custom Uploaded Player Data"
        else:
            new_id = f"IPL27-CUSTOM-{db.query(Player).count() + 1:03d}"
            new_p = Player(
                id=new_id,
                name=p["name"],
                role=p["role"],
                country=p["country"],
                is_overseas=p["is_overseas"],
                base_price_lakh=p["base_price_lakh"],
                base_price_cr=p["base_price_cr"],
                auction_category=p["auction_category"],
                auction_set=p["auction_set"],
                previous_teams=p.get("previous_teams", ""),
                availability="Available",
                auction_mode=mode,
                data_status="Custom Uploaded Player Data",
                player_image=f"https://api.dicebear.com/7.x/bottts/svg?seed={p['name'].replace(' ', '')}"
            )
            db.add(new_p)
        imported_count += 1

    db.commit()
    return {
        "success": True,
        "message": f"Successfully validated and imported {imported_count} players into the {mode.capitalize()} Auction database.",
        "imported_count": imported_count,
        "warnings": errors
    }

@router.put("/players/{player_id}")
def update_player(player_id: str, updates: Dict[str, Any], db: Session = Depends(get_db)):
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found.")

    if "base_price_lakh" in updates:
        player.base_price_lakh = int(updates["base_price_lakh"])
        player.base_price_cr = round(player.base_price_lakh / 100.0, 2)
    if "auction_set" in updates:
        player.auction_set = updates["auction_set"].upper()
    if "auction_category" in updates:
        player.auction_category = updates["auction_category"]
    if "availability" in updates:
        player.availability = updates["availability"]
    if "role" in updates:
        player.role = updates["role"]
    player.data_status = "Administrator Updated Data"

    db.commit()
    db.refresh(player)
    return {"success": True, "player_id": player.id}

@router.post("/reset-demo")
def reset_demo_database(db: Session = Depends(get_db)):
    # Clear active rooms and live state
    bidding_manager.room_states.clear()
    
    # Remove mock rooms
    db.query(BidLog).delete()
    db.query(SquadMember).delete()
    db.query(RoomTeamState).delete()
    db.query(RoomParticipant).delete()
    db.query(AuctionRoom).delete()
    db.commit()

    # Re-seed fresh base data
    seed_database(db)
    return {"success": True, "message": "Demo database successfully reset with official IPL 2027 presets."}
