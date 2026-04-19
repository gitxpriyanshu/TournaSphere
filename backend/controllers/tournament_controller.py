from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas.tournament import TournamentCreate, TournamentOut, TournamentUpdate
from services.tournament_service import TournamentService
from utils.dependencies import require_admin, get_current_user

router = APIRouter()

@router.post("", response_model=TournamentOut, status_code=status.HTTP_201_CREATED)
def create_tournament(data: TournamentCreate, admin = Depends(require_admin), db: Session = Depends(get_db)):
    service = TournamentService(db)
    return service.create_tournament(data, admin)

@router.get("", response_model=List[TournamentOut])
def get_all_tournaments(user = Depends(get_current_user), db: Session = Depends(get_db)):
    service = TournamentService(db)
    return service.get_all_tournaments()

@router.get("/{id}", response_model=TournamentOut)
def get_tournament(id: int, user = Depends(get_current_user), db: Session = Depends(get_db)):
    service = TournamentService(db)
    return service.get_tournament_by_id(id)

@router.patch("/{id}/status", response_model=TournamentOut)
def update_status(id: int, data: TournamentUpdate, admin = Depends(require_admin), db: Session = Depends(get_db)):
    service = TournamentService(db)
    return service.update_tournament_status(id, data.status)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tournament(id: int, admin = Depends(require_admin), db: Session = Depends(get_db)):
    service = TournamentService(db)
    service.delete_tournament(id)
    return
