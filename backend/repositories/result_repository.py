from sqlalchemy.orm import Session
from models.match_result import MatchResult
from schemas.result import ResultCreate

class ResultRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_result(self, data: ResultCreate, winner_team_id: int | None):
        db_result = MatchResult(
            match_id=data.match_id,
            score_team_a=data.score_team_a,
            score_team_b=data.score_team_b,
            winner_team_id=winner_team_id
        )
        self.db.add(db_result)
        self.db.commit()
        self.db.refresh(db_result)
        return db_result

    def get_result_by_match(self, match_id: int):
        return self.db.query(MatchResult).filter(MatchResult.match_id == match_id).first()
