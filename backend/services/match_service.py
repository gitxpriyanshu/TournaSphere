from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timezone
from repositories.match_repository import MatchRepository
from models.match import MatchStatus
from schemas.match import MatchScheduleUpdate

class MatchService:
    def __init__(self, db: Session):
        self.repository = MatchRepository(db)

    def schedule_match(self, match_id: int, data: MatchScheduleUpdate):
        match = self.repository.get_match_by_id(match_id)
        if not match:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")
            
        # Ensure scheduled_at is in the future
        # Fast API datetimes are usually naive or timezone aware, handle carefully
        now = datetime.now(timezone.utc) if data.scheduled_at.tzinfo else datetime.now()
        if data.scheduled_at <= now:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Scheduled time must be in the future"
            )

        # Check for conflicts
        conflict_a = self.repository.check_schedule_conflict(match.team_a_id, data.scheduled_at, match_id)
        if conflict_a:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Team A already has a match scheduled at this time")
            
        conflict_b = self.repository.check_schedule_conflict(match.team_b_id, data.scheduled_at, match_id)
        if conflict_b:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Team B already has a match scheduled at this time")

        return self.repository.update_match_schedule(match_id, data.scheduled_at, data.venue)

    def update_match_status(self, match_id: int, new_status: MatchStatus):
        match = self.repository.get_match_by_id(match_id)
        if not match:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")
            
        current = match.status
        valid = False
        if current == MatchStatus.SCHEDULED and new_status == MatchStatus.LIVE:
            valid = True
        elif current == MatchStatus.LIVE and new_status == MatchStatus.COMPLETED:
            valid = True
            
        if not valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid transition from {current.value} to {new_status.value}"
            )
            
        return self.repository.update_match_status(match_id, new_status)

    def get_matches_by_tournament(self, tournament_id: int):
        return self.repository.get_matches_by_tournament(tournament_id)

    def get_match_by_id(self, id: int):
        match = self.repository.get_match_by_id(id)
        if not match:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")
        return match
