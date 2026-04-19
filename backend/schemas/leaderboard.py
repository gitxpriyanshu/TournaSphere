from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class LeaderboardEntry(BaseModel):
    team_id: int
    team_name: str
    points: int
    wins: int
    losses: int
    rank: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class LeaderboardOut(BaseModel):
    tournament_id: int
    entries: List[LeaderboardEntry]

    model_config = ConfigDict(from_attributes=True)
