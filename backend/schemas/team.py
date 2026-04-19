from pydantic import BaseModel, ConfigDict
from models.team import TeamStatus

class TeamCreate(BaseModel):
    name: str
    tournament_id: int

class TeamOut(BaseModel):
    id: int
    name: str
    status: TeamStatus
    captain_id: int
    tournament_id: int

    model_config = ConfigDict(from_attributes=True)

class TeamStatusUpdate(BaseModel):
    status: TeamStatus
