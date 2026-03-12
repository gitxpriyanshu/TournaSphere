import enum
from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class TournamentStatus(str, enum.Enum):
    UPCOMING = "upcoming"
    ONGOING = "ongoing"
    COMPLETED = "completed"

class Tournament(Base):
    __tablename__ = "tournaments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sport_type = Column(String, nullable=False)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    status = Column(Enum(TournamentStatus), default=TournamentStatus.UPCOMING, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    creator = relationship("User", back_populates="tournaments")
    teams = relationship("Team", back_populates="tournament")
    matches = relationship("Match", back_populates="tournament")
    leaderboards = relationship("Leaderboard", back_populates="tournament")

    def __repr__(self):
        return f"<Tournament(name='{self.name}', sport_type='{self.sport_type}', status='{self.status}')>"
