from sqlalchemy.orm import Session
from models.tournament import Tournament, TournamentStatus
from schemas.tournament import TournamentCreate

class TournamentRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_tournament(self, data: TournamentCreate, admin_id: int):
        db_tournament = Tournament(
            name=data.name,
            sport_type=data.sport_type,
            start_date=data.start_date,
            end_date=data.end_date,
            created_by=admin_id
        )
        self.db.add(db_tournament)
        self.db.commit()
        self.db.refresh(db_tournament)
        return db_tournament

    def get_all_tournaments(self):
        return self.db.query(Tournament).all()

    def get_tournament_by_id(self, id: int):
        return self.db.query(Tournament).filter(Tournament.id == id).first()

    def update_tournament_status(self, id: int, status: TournamentStatus):
        tournament = self.get_tournament_by_id(id)
        if tournament:
            tournament.status = status
            self.db.commit()
            self.db.refresh(tournament)
        return tournament

    def delete_tournament(self, id: int):
        tournament = self.get_tournament_by_id(id)
        if tournament:
            self.db.delete(tournament)
            self.db.commit()
            return True
        return False
