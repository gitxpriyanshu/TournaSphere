from sqlalchemy.orm import Session
from models.player import Player
from models.team import Team
from schemas.player import PlayerAdd

class PlayerRepository:
    def __init__(self, db: Session):
        self.db = db

    def add_player(self, data: PlayerAdd):
        db_player = Player(
            user_id=data.user_id,
            team_id=data.team_id,
            jersey_number=data.jersey_number
        )
        self.db.add(db_player)
        self.db.commit()
        self.db.refresh(db_player)
        return db_player

    def remove_player(self, player_id: int):
        player = self.get_player_by_id(player_id)
        if player:
            self.db.delete(player)
            self.db.commit()
            return True
        return False

    def get_player_by_id(self, player_id: int):
        return self.db.query(Player).filter(Player.id == player_id).first()

    def get_players_by_team(self, team_id: int):
        return self.db.query(Player).filter(Player.team_id == team_id).all()

    def get_player_by_user_and_team(self, user_id: int, team_id: int):
        return self.db.query(Player).filter(
            Player.user_id == user_id,
            Player.team_id == team_id
        ).first()

    def get_player_by_user_and_tournament(self, user_id: int, tournament_id: int):
        # Join Player and Team to find if the user is in ANY team in the given tournament
        return self.db.query(Player).join(Team).filter(
            Player.user_id == user_id,
            Team.tournament_id == tournament_id
        ).first()

    def count_players_in_team(self, team_id: int):
        return self.db.query(Player).filter(Player.team_id == team_id).count()
