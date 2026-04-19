from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Leaderboard(Base):
    __tablename__ = "leaderboards"

    id = Column(Integer, primary_key=True, index=True)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    points = Column(Integer, default=0)
    wins = Column(Integer, default=0)
    losses = Column(Integer, default=0)
    goals_for = Column(Integer, default=0)
    goals_against = Column(Integer, default=0)
    rank = Column(Integer)

    tournament = relationship("Tournament", back_populates="leaderboards")
    team = relationship("Team", back_populates="leaderboards")

    def __repr__(self):
        return f"<Leaderboard(tournament_id={self.tournament_id}, team_id={self.team_id}, points={self.points})>"
