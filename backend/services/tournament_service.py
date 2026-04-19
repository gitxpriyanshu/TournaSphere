from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repositories.tournament_repository import TournamentRepository
from schemas.tournament import TournamentCreate, TournamentStatus
from models.user import User

class TournamentService:
    def __init__(self, db: Session):
        self.repository = TournamentRepository(db)

    def create_tournament(self, data: TournamentCreate, admin: User):
        return self.repository.create_tournament(data, admin.id)

    def get_all_tournaments(self):
        return self.repository.get_all_tournaments()

    def get_tournament_by_id(self, id: int):
        tournament = self.repository.get_tournament_by_id(id)
        if not tournament:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
        return tournament

    def update_tournament_status(self, id: int, new_status: TournamentStatus):
        tournament = self.get_tournament_by_id(id)
        
        # Validate transitions: UPCOMING -> ONGOING -> COMPLETED
        current = tournament.status
        valid = False
        if current == TournamentStatus.UPCOMING and new_status == TournamentStatus.ONGOING:
            valid = True
        elif current == TournamentStatus.ONGOING and new_status == TournamentStatus.COMPLETED:
            valid = True
        
        if not valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Invalid transition from {current.value} to {new_status.value}"
            )
            
        return self.repository.update_tournament_status(id, new_status)

    def delete_tournament(self, id: int):
        # ensure exists first
        self.get_tournament_by_id(id)
        return self.repository.delete_tournament(id)
