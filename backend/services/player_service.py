from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repositories.player_repository import PlayerRepository
from repositories.team_repository import TeamRepository
from schemas.player import PlayerAdd
from models.user import User

class PlayerService:
    def __init__(self, db: Session):
        self.repository = PlayerRepository(db)
        self.team_repository = TeamRepository(db)

    def _verify_team_captaincy(self, team_id: int, user: User):
        team = self.team_repository.get_team_by_id(team_id)
        if not team:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
        if team.captain_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the Team Captain can manage players for this team")
        return team

    def add_player(self, data: PlayerAdd, captain: User):
        # 1. Verify captaincy
        team = self._verify_team_captaincy(data.team_id, captain)

        # 2. Prevent duplicate adding to same team
        existing_in_team = self.repository.get_player_by_user_and_team(data.user_id, data.team_id)
        if existing_in_team:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Player is already in this team")

        # 3. A user cannot be added to two teams in the same tournament
        existing_in_tournament = self.repository.get_player_by_user_and_tournament(data.user_id, team.tournament_id)
        if existing_in_tournament:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Player is already in another team in this tournament")

        # 4. Max 15 players per team
        count = self.repository.count_players_in_team(data.team_id)
        if count >= 15:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Team has reached the maximum limit of 15 players")

        return self.repository.add_player(data)

    def remove_player(self, player_id: int, captain: User):
        player = self.repository.get_player_by_id(player_id)
        if not player:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")
            
        # Verify captaincy of the team this player belongs to
        self._verify_team_captaincy(player.team_id, captain)
        
        return self.repository.remove_player(player_id)

    def get_players_by_team(self, team_id: int):
        return self.repository.get_players_by_team(team_id)
