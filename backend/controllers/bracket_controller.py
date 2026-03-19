from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas.match import MatchOut
from services.bracket_service import BracketService
from utils.dependencies import require_organizer

router = APIRouter()

@router.post("/generate/{tournament_id}", response_model=List[MatchOut], status_code=status.HTTP_201_CREATED)
def generate_bracket(tournament_id: int, organizer = Depends(require_organizer), db: Session = Depends(get_db)):
    """ Generate the initial bracket (Round 1 matches) for a specific tournament """
    service = BracketService(db)
    return service.generate_bracket(tournament_id)
