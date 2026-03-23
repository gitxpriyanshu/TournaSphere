from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.result import ResultCreate, ResultOut
from schemas.leaderboard import LeaderboardOut
from services.result_service import ResultService
from services.leaderboard_service import LeaderboardService
from utils.dependencies import require_organizer, get_current_user

router = APIRouter()

@router.post("/results", response_model=ResultOut, status_code=status.HTTP_201_CREATED)
def record_result(data: ResultCreate, organizer = Depends(require_organizer), db: Session = Depends(get_db)):
    """ Securely record match outcome and recalculate scoreboards. """
    service = ResultService(db)
    return service.record_result(data, organizer)

@router.get("/results/{match_id}", response_model=ResultOut)
def get_result(match_id: int, user = Depends(get_current_user), db: Session = Depends(get_db)):
    """ Public access to view matched outcomes. """
    service = ResultService(db)
    return service.get_result(match_id)

@router.get("/leaderboard/{tournament_id}", response_model=LeaderboardOut)
def get_leaderboard(tournament_id: int, user = Depends(get_current_user), db: Session = Depends(get_db)):
    """ Fetch generated leaderboard rankings safely. """
    service = LeaderboardService(db)
    return service.get_leaderboard(tournament_id)
