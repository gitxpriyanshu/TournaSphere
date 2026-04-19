from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ResultCreate(BaseModel):
    match_id: int
    score_team_a: int
    score_team_b: int

class ResultOut(BaseModel):
    id: int
    match_id: int
    score_team_a: int
    score_team_b: int
    winner_team_id: int | None
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)
