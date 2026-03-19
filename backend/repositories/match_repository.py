from sqlalchemy.orm import Session
from sqlalchemy import or_
from models.match import Match, MatchStatus
from datetime import datetime

class MatchRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_matches_by_tournament(self, tournament_id: int):
        return self.db.query(Match).filter(Match.tournament_id == tournament_id).all()

    def get_match_by_id(self, match_id: int):
        return self.db.query(Match).filter(Match.id == match_id).first()

    def update_match_schedule(self, match_id: int, scheduled_at: datetime, venue: str):
        match = self.get_match_by_id(match_id)
        if match:
            match.scheduled_at = scheduled_at
            match.venue = venue
            self.db.commit()
            self.db.refresh(match)
        return match

    def update_match_status(self, match_id: int, status: MatchStatus):
        match = self.get_match_by_id(match_id)
        if match:
            match.status = status
            self.db.commit()
            self.db.refresh(match)
        return match

    def get_matches_by_team(self, team_id: int):
        return self.db.query(Match).filter(
            or_(Match.team_a_id == team_id, Match.team_b_id == team_id)
        ).all()
        
    def check_schedule_conflict(self, team_id: int, target_time: datetime, match_to_exclude: int):
        return self.db.query(Match).filter(
            or_(Match.team_a_id == team_id, Match.team_b_id == team_id),
            Match.scheduled_at == target_time,
            Match.id != match_to_exclude
        ).first()
