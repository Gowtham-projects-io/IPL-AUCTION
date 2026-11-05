from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Season
from backend.app.schemas import SeasonOut

router = APIRouter(prefix="/seasons", tags=["IPL Season Configuration"])

@router.get("/current", response_model=SeasonOut)
def get_current_season(db: Session = Depends(get_db)):
    season = db.query(Season).filter(Season.id == "ipl-2027").first()
    if not season:
        season = Season(
            id="ipl-2027",
            name="IPL 2027 Season",
            year=2027,
            default_purse_cr=120.0,
            min_squad=18,
            max_squad=25,
            max_overseas=8,
            countdown_seconds=10,
            status="active",
            rules_notes="Configured with official IPL 2027 parameters: ₹120 Crore team purse, 18-25 squad limit, max 8 overseas players. Supports both Mega Auction (clean squads) and Mini Auction (with team retentions)."
        )
        db.add(season)
        db.commit()
        db.refresh(season)
    return SeasonOut.model_validate(season)
