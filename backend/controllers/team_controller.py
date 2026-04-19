from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas.team import TeamCreate, TeamOut, TeamStatusUpdate
from services.team_service import TeamService
from utils.dependencies import require_admin, require_organizer, require_captain, get_current_user

router = APIRouter()

@router.post("", response_model=TeamOut, status_code=status.HTTP_201_CREATED)
def create_team(data: TeamCreate, captain = Depends(require_captain), db: Session = Depends(get_db)):
    service = TeamService(db)
    return service.create_team(data, captain)

@router.get("", response_model=List[TeamOut])
def get_teams(tournament_id: int, user = Depends(get_current_user), db: Session = Depends(get_db)):
    service = TeamService(db)
    return service.get_teams_by_tournament(tournament_id)

@router.get("/{id}", response_model=TeamOut)
def get_team(id: int, user = Depends(get_current_user), db: Session = Depends(get_db)):
    service = TeamService(db)
    return service.get_team_by_id(id)

@router.patch("/{id}/status", response_model=TeamOut)
def update_team_status(id: int, data: TeamStatusUpdate, organizer = Depends(require_organizer), db: Session = Depends(get_db)):
    service = TeamService(db)
    return service.update_team_status(id, data.status)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(id: int, admin = Depends(require_admin), db: Session = Depends(get_db)):
    service = TeamService(db)
    service.delete_team(id)
    return
