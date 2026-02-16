from pydantic import BaseModel, ConfigDict
from typing import Optional

class PlayerAdd(BaseModel):
    user_id: int
    team_id: int
    jersey_number: Optional[str] = None

class PlayerOut(BaseModel):
    id: int
    user_id: int
    team_id: int
    jersey_number: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
