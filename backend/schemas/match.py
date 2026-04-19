from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from models.match import MatchStatus

class MatchCreate(BaseModel):
    tournament_id: int
    team_a_id: int
    team_b_id: int
    scheduled_at: Optional[datetime] = None
    venue: Optional[str] = None
    round_number: int

class MatchOut(BaseModel):
    id: int
    tournament_id: int
    team_a_id: int
    team_b_id: int
    scheduled_at: Optional[datetime] = None
    venue: Optional[str] = None
    status: MatchStatus
    round_number: int

    model_config = ConfigDict(from_attributes=True)

class MatchScheduleUpdate(BaseModel):
    scheduled_at: Optional[datetime] = None
    venue: str

class MatchStatusUpdate(BaseModel):
    status: MatchStatus
