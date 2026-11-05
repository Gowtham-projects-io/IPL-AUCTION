from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.database import get_db
from backend.app.models import Team, Retention, RoomTeamState, SquadMember
from backend.app.schemas import TeamOut, RetentionOut, SquadMemberOut

router = APIRouter(prefix="/teams", tags=["IPL Teams"])

@router.get("/", response_model=List[TeamOut])
def get_all_teams(db: Session = Depends(get_db)):
    teams = db.query(Team).all()
    return [TeamOut.model_validate(t) for t in teams]

@router.get("/{team_id}", response_model=TeamOut)
def get_team_detail(team_id: str, db: Session = Depends(get_db)):
    team = db.query(Team).filter(Team.id == team_id.upper()).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found.")
    return TeamOut.model_validate(team)

@router.get("/{team_id}/retentions", response_model=List[RetentionOut])
def get_team_retentions(team_id: str, db: Session = Depends(get_db)):
    retentions = db.query(Retention).filter(Retention.team_id == team_id.upper()).all()
    return [RetentionOut.model_validate(r) for r in retentions]

@router.get("/{team_id}/squad/{room_id}", response_model=List[SquadMemberOut])
def get_team_squad_in_room(team_id: str, room_id: str, db: Session = Depends(get_db)):
    squad = db.query(SquadMember).filter(
        SquadMember.room_id == room_id,
        SquadMember.team_id == team_id.upper()
    ).all()
    return [SquadMemberOut.model_validate(s) for s in squad]
