from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repositories.team_repository import TeamRepository
from schemas.team import TeamCreate, TeamStatus
from models.user import User

class TeamService:
    def __init__(self, db: Session):
        self.repository = TeamRepository(db)

    def create_team(self, data: TeamCreate, captain: User):
        # Validate that the captain doesn't already have a team in this tournament
        existing_team = self.repository.get_team_by_captain_and_tournament(captain.id, data.tournament_id)
        if existing_team:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="You can only captain one team per tournament"
            )
            
        return self.repository.create_team(data, captain.id)

    def get_teams_by_tournament(self, tournament_id: int):
        return self.repository.get_teams_by_tournament(tournament_id)

    def get_team_by_id(self, id: int):
        team = self.repository.get_team_by_id(id)
        if not team:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
        return team

    def update_team_status(self, id: int, new_status: TeamStatus):
        # Organizer/Admin can approve or reject
        team = self.get_team_by_id(id)
        if new_status not in [TeamStatus.APPROVED, TeamStatus.REJECTED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status can only be updated to approved or rejected"
            )
        return self.repository.update_team_status(id, new_status)

    def delete_team(self, id: int):
        self.get_team_by_id(id)
        return self.repository.delete_team(id)
