import enum
from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class TeamStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"), nullable=False)
    captain_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(TeamStatus), default=TeamStatus.PENDING, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tournament = relationship("Tournament", back_populates="teams")
    captain = relationship("User", back_populates="teams_captained")
    players = relationship("Player", back_populates="team")
    
    matches_team_a = relationship("Match", foreign_keys="Match.team_a_id", back_populates="team_a")
    matches_team_b = relationship("Match", foreign_keys="Match.team_b_id", back_populates="team_b")
    match_results = relationship("MatchResult", back_populates="winner_team")
    leaderboards = relationship("Leaderboard", back_populates="team")

    def __repr__(self):
        return f"<Team(name='{self.name}', status='{self.status}')>"
