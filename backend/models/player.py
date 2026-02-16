from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    jersey_number = Column(String)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="players")
    team = relationship("Team", back_populates="players")

    def __repr__(self):
        return f"<Player(user_id={self.user_id}, team_id={self.team_id})>"
