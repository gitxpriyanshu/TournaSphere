from sqlalchemy.orm import Session
from models.team import Team, TeamStatus
from schemas.team import TeamCreate

class TeamRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_team(self, data: TeamCreate, captain_id: int):
        db_team = Team(
            name=data.name,
            tournament_id=data.tournament_id,
            captain_id=captain_id
        )
        self.db.add(db_team)
        self.db.commit()
        self.db.refresh(db_team)
        return db_team

    def get_teams_by_tournament(self, tournament_id: int):
        return self.db.query(Team).filter(Team.tournament_id == tournament_id).all()

    def get_team_by_id(self, id: int):
        return self.db.query(Team).filter(Team.id == id).first()
        
    def get_team_by_captain_and_tournament(self, captain_id: int, tournament_id: int):
        return self.db.query(Team).filter(
            Team.captain_id == captain_id, 
            Team.tournament_id == tournament_id
        ).first()

    def update_team_status(self, id: int, status: TeamStatus):
        team = self.get_team_by_id(id)
        if team:
            team.status = status
            self.db.commit()
            self.db.refresh(team)
        return team

    def delete_team(self, id: int):
        team = self.get_team_by_id(id)
        if team:
            self.db.delete(team)
            self.db.commit()
            return True
        return False
