from pydantic import BaseModel, ConfigDict
from datetime import datetime
from models.tournament import TournamentStatus

class TournamentCreate(BaseModel):
    name: str
    sport_type: str
    start_date: datetime
    end_date: datetime

class TournamentOut(BaseModel):
    id: int
    name: str
    sport_type: str
    start_date: datetime
    end_date: datetime
    status: TournamentStatus

    model_config = ConfigDict(from_attributes=True)

class TournamentUpdate(BaseModel):
    status: TournamentStatus
