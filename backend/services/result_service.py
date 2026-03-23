from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repositories.result_repository import ResultRepository
from repositories.match_repository import MatchRepository
from schemas.result import ResultCreate
from models.match import MatchStatus
from models.user import User
from services.leaderboard_service import LeaderboardService

class ResultService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = ResultRepository(db)
        self.match_repository = MatchRepository(db)
        self.leaderboard_service = LeaderboardService(db)

    def record_result(self, data: ResultCreate, organizer: User):
        match = self.match_repository.get_match_by_id(data.match_id)
        if not match:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")
            
        if match.status not in [MatchStatus.LIVE, MatchStatus.COMPLETED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Match must be LIVE or COMPLETED to record a result"
            )

        existing = self.repository.get_result_by_match(data.match_id)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Result already recorded for this match")

        # Determine winner
        winner_team_id = None
        if data.score_team_a > data.score_team_b:
            winner_team_id = match.team_a_id
        elif data.score_team_b > data.score_team_a:
            winner_team_id = match.team_b_id
        
        # Save result
        result = self.repository.create_result(data, winner_team_id)
        
        # Update match status to completed
        self.match_repository.update_match_status(match.id, MatchStatus.COMPLETED)
        
        # Trigger leaderboard recalculation automatically!
        self.leaderboard_service.recalculate_leaderboard(match.tournament_id)
        
        return result

    def get_result(self, match_id: int):
        result = self.repository.get_result_by_match(match_id)
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")
        return result
