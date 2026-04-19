from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class MatchResult(Base):
    __tablename__ = "match_results"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"), unique=True, nullable=False)
    score_team_a = Column(Integer, default=0)
    score_team_b = Column(Integer, default=0)
    winner_team_id = Column(Integer, ForeignKey("teams.id"))
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

    match = relationship("Match", back_populates="result")
    winner_team = relationship("Team", back_populates="match_results")

    def __repr__(self):
        return f"<MatchResult(match_id={self.match_id}, score_a={self.score_team_a}, score_b={self.score_team_b})>"
