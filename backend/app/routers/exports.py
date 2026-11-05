import os
import io
import csv
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import SquadMember, RoomTeamState, Team, AuctionRoom

router = APIRouter(prefix="/exports", tags=["CSV & Results Exports"])

@router.get("/csv/mega")
def download_mega_csv():
    filepath = "backend/data/IPL_2027_Mega_Auction_Players.csv"
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Mega Auction CSV file not found.")
    return FileResponse(
        path=filepath,
        filename="IPL_2027_Mega_Auction_Players.csv",
        media_type="text/csv"
    )

@router.get("/csv/mini")
def download_mini_csv():
    filepath = "backend/data/IPL_2027_Mini_Auction_Players.csv"
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Mini Auction CSV file not found.")
    return FileResponse(
        path=filepath,
        filename="IPL_2027_Mini_Auction_Players.csv",
        media_type="text/csv"
    )

@router.get("/results/{room_id}")
def get_auction_results_summary(room_id: str, db: Session = Depends(get_db)):
    room = db.query(AuctionRoom).filter(AuctionRoom.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found.")

    team_states = db.query(RoomTeamState).filter(RoomTeamState.room_id == room_id).all()
    squad_members = db.query(SquadMember).filter(SquadMember.room_id == room_id).all()

    # Find most expensive buy
    bought_players = [s for s in squad_members if not s.is_retained]
    most_expensive = max(bought_players, key=lambda s: s.price_lakh) if bought_players else None

    # Group squads by team
    team_squads = {}
    for ts in team_states:
        team_obj = db.query(Team).filter(Team.id == ts.team_id).first()
        members = [s for s in squad_members if s.team_id == ts.team_id]
        
        roles_count = {"Batter": 0, "Bowler": 0, "All-rounder": 0, "Wicketkeeper": 0}
        for m in members:
            r = m.role if m.role in roles_count else "Batter"
            roles_count[r] += 1

        team_squads[ts.team_id] = {
            "team_name": team_obj.name if team_obj else ts.team_id,
            "short_name": ts.team_id,
            "primary_color": team_obj.primary_color if team_obj else "#76DCC5",
            "logo": team_obj.logo if team_obj else None,
            "total_purse_cr": ts.total_purse_cr,
            "spent_purse_cr": ts.spent_purse_cr,
            "remaining_purse_cr": ts.remaining_purse_cr,
            "squad_count": ts.squad_count,
            "overseas_count": ts.overseas_count,
            "role_distribution": roles_count,
            "players": [
                {
                    "name": m.player_name,
                    "role": m.role,
                    "country": m.country,
                    "is_overseas": m.is_overseas,
                    "price_lakh": m.price_lakh,
                    "price_cr": m.price_cr,
                    "is_retained": m.is_retained
                } for m in members
            ]
        }

    return {
        "room_id": room_id,
        "room_name": room.name,
        "auction_mode": room.auction_mode,
        "total_players_acquired": len(squad_members),
        "most_expensive_player": {
            "name": most_expensive.player_name,
            "team_id": most_expensive.team_id,
            "price_lakh": most_expensive.price_lakh,
            "price_cr": most_expensive.price_cr
        } if most_expensive else None,
        "teams": team_squads
    }

@router.get("/results/{room_id}/download-csv")
def download_auction_results_csv(room_id: str, db: Session = Depends(get_db)):
    squad_members = db.query(SquadMember).filter(SquadMember.room_id == room_id).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Team ID", "Player Name", "Role", "Country", 
        "Overseas Status", "Price (₹ Lakh)", "Price (₹ Cr)", "Acquisition Type"
    ])

    for s in squad_members:
        writer.writerow([
            s.team_id,
            s.player_name,
            s.role,
            s.country,
            "Overseas" if s.is_overseas else "Indian",
            s.price_lakh,
            s.price_cr,
            "Retained" if s.is_retained else "Auction Purchase"
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=IPL_2027_Auction_Results_{room_id}.csv"}
    )
