import enum
from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class MatchStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    LIVE = "live"
    COMPLETED = "completed"

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"), nullable=False)
    team_a_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    team_b_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    scheduled_at = Column(DateTime(timezone=True))
    venue = Column(String)
    status = Column(Enum(MatchStatus), default=MatchStatus.SCHEDULED, nullable=False)
    round_number = Column(Integer)

    tournament = relationship("Tournament", back_populates="matches")
    team_a = relationship("Team", foreign_keys=[team_a_id], back_populates="matches_team_a")
    team_b = relationship("Team", foreign_keys=[team_b_id], back_populates="matches_team_b")
    result = relationship("MatchResult", back_populates="match", uselist=False)

    def __repr__(self):
        return f"<Match(id={self.id}, tournament_id={self.tournament_id}, status='{self.status}')>"
