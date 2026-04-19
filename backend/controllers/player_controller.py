from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas.player import PlayerAdd, PlayerOut
from services.player_service import PlayerService
from utils.dependencies import require_captain, get_current_user

router = APIRouter()

@router.post("", response_model=PlayerOut, status_code=status.HTTP_201_CREATED)
def add_player(data: PlayerAdd, captain = Depends(require_captain), db: Session = Depends(get_db)):
    service = PlayerService(db)
    return service.add_player(data, captain)

@router.delete("/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_player(player_id: int, captain = Depends(require_captain), db: Session = Depends(get_db)):
    service = PlayerService(db)
    service.remove_player(player_id, captain)
    return

@router.get("", response_model=List[PlayerOut])
def get_players(team_id: int, user = Depends(get_current_user), db: Session = Depends(get_db)):
    service = PlayerService(db)
    return service.get_players_by_team(team_id)
