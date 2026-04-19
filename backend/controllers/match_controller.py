from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from schemas.match import MatchOut, MatchScheduleUpdate, MatchStatusUpdate
from services.match_service import MatchService
from utils.dependencies import require_organizer, get_current_user

router = APIRouter()

@router.get("", response_model=List[MatchOut])
def get_matches(tournament_id: int, user = Depends(get_current_user), db: Session = Depends(get_db)):
    service = MatchService(db)
    return service.get_matches_by_tournament(tournament_id)

@router.get("/{id}", response_model=MatchOut)
def get_match(id: int, user = Depends(get_current_user), db: Session = Depends(get_db)):
    service = MatchService(db)
    return service.get_match_by_id(id)

@router.patch("/{id}/schedule", response_model=MatchOut)
def schedule_match(id: int, data: MatchScheduleUpdate, organizer = Depends(require_organizer), db: Session = Depends(get_db)):
    service = MatchService(db)
    return service.schedule_match(id, data)

@router.patch("/{id}/status", response_model=MatchOut)
def update_status(id: int, data: MatchStatusUpdate, organizer = Depends(require_organizer), db: Session = Depends(get_db)):
    service = MatchService(db)
    return service.update_match_status(id, data.status)
