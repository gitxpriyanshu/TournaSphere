from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.team import Team, TeamStatus
from models.match import Match, MatchStatus
from utils.bracket_engine import BracketContext, KnockoutBracketStrategy

class BracketService:
    def __init__(self, db: Session):
        self.db = db

    def generate_bracket(self, tournament_id: int):
        # 1. Fetch all approved teams for the tournament
        approved_teams = self.db.query(Team).filter(
            Team.tournament_id == tournament_id,
            Team.status == TeamStatus.APPROVED
        ).all()

        # 2. Validate: minimum 2 teams required
        if len(approved_teams) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="At least 2 approved teams are required to generate a bracket"
            )

        # 3. Validate: bracket not already generated (check if round 1 matches exist)
        existing_matches = self.db.query(Match).filter(
            Match.tournament_id == tournament_id,
            Match.round_number == 1
        ).first()
        
        if existing_matches is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="A bracket has already been generated for this tournament"
            )

        # 4. Use Context with Knockout Strategy
        context = BracketContext(KnockoutBracketStrategy())
        pairs = context.generate_bracket(approved_teams)

        # 5. Bulk insert generated match pairs into Match table
        created_matches = []
        for pair in pairs:
            match = Match(
                tournament_id=tournament_id,
                team_a_id=pair["team_a_id"],
                team_b_id=pair["team_b_id"],
                round_number=pair["round_number"],
                status=MatchStatus.SCHEDULED,
                # scheduled_at and venue can be updated later
            )
            self.db.add(match)
            created_matches.append(match)
            
        self.db.commit()
        
        for m in created_matches:
            self.db.refresh(m)

        return created_matches
