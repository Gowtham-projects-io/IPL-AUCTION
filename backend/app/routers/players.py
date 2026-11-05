from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models import Player
from backend.app.schemas import PlayerOut

router = APIRouter(prefix="/players", tags=["Player Database"])

@router.get("/", response_model=List[PlayerOut])
def get_players(
    mode: Optional[str] = Query(None, description="mega or mini"),
    role: Optional[str] = Query(None, description="Batter, Bowler, All-rounder, Wicketkeeper"),
    category: Optional[str] = Query(None, description="Marquee, Capped Indian, etc."),
    auction_set: Optional[str] = Query(None, description="M1, BA1, AL1, etc."),
    country: Optional[str] = Query(None),
    is_overseas: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(Player)

    if mode and isinstance(mode, str):
        query = query.filter(Player.auction_mode.in_([mode.lower(), "both"]))
    if role and isinstance(role, str):
        query = query.filter(Player.role.ilike(f"%{role}%"))
    if category and isinstance(category, str):
        query = query.filter(Player.auction_category.ilike(f"%{category}%"))
    if auction_set and isinstance(auction_set, str):
        query = query.filter(Player.auction_set == auction_set.upper())
    if country and isinstance(country, str):
        query = query.filter(Player.country.ilike(f"%{country}%"))
    if is_overseas is not None and isinstance(is_overseas, bool):
        query = query.filter(Player.is_overseas == is_overseas)
    if search and isinstance(search, str):
        query = query.filter(
            (Player.name.ilike(f"%{search}%")) |
            (Player.previous_teams.ilike(f"%{search}%"))
        )

    lim = limit if isinstance(limit, int) else 100
    off = offset if isinstance(offset, int) else 0
    players = query.offset(off).limit(lim).all()
    return [PlayerOut.model_validate(p) for p in players]

@router.get("/sets")
def get_available_sets(mode: Optional[str] = "mega", db: Session = Depends(get_db)):
    query = db.query(Player.auction_set).distinct()
    if mode:
        query = query.filter(Player.auction_mode.in_([mode.lower(), "both"]))
    sets = [r[0] for r in query.all() if r[0]]
    # Custom sort
    def set_key(s):
        if s.startswith("M"): return (0, s)
        if s.startswith("BA"): return (1, s)
        if s.startswith("AL"): return (2, s)
        if s.startswith("WK"): return (3, s)
        if s.startswith("FA"): return (4, s)
        if s.startswith("SP"): return (5, s)
        return (6, s)
    sets.sort(key=set_key)
    return {"sets": sets}

@router.get("/{player_id}", response_model=PlayerOut)
def get_player_by_id(player_id: str, db: Session = Depends(get_db)):
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found.")
    return PlayerOut.model_validate(player)
