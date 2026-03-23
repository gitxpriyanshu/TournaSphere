from sqlalchemy.orm import Session
from collections import defaultdict
from models.match import Match, MatchStatus
from models.match_result import MatchResult
from models.team import Team
from models.leaderboard import Leaderboard
from schemas.leaderboard import LeaderboardOut, LeaderboardEntry

class LeaderboardService:
    def __init__(self, db: Session):
        self.db = db

    def recalculate_leaderboard(self, tournament_id: int):
        # 1. Fetch all completed matches and their results for this tournament
        matches = self.db.query(Match).filter(
            Match.tournament_id == tournament_id,
            Match.status == MatchStatus.COMPLETED
        ).all()

        stats = defaultdict(lambda: {"wins": 0, "losses": 0, "draws": 0, "gf": 0, "ga": 0})
        teams_in_bracket = set()

        for match in matches:
            teams_in_bracket.add(match.team_a_id)
            teams_in_bracket.add(match.team_b_id)
            if not match.result:
                continue

            res = match.result
            stats[match.team_a_id]["gf"] += res.score_team_a
            stats[match.team_a_id]["ga"] += res.score_team_b
            stats[match.team_b_id]["gf"] += res.score_team_b
            stats[match.team_b_id]["ga"] += res.score_team_a

            if res.score_team_a > res.score_team_b:
                stats[match.team_a_id]["wins"] += 1
                stats[match.team_b_id]["losses"] += 1
            elif res.score_team_b > res.score_team_a:
                stats[match.team_b_id]["wins"] += 1
                stats[match.team_a_id]["losses"] += 1
            else:
                stats[match.team_a_id]["draws"] += 1
                stats[match.team_b_id]["draws"] += 1

        # 2. Calculate points: Win = 3, Draw = 1, Loss = 0
        ranking_list = []
        for team_id in teams_in_bracket:
            s = stats[team_id]
            points = (s["wins"] * 3) + (s["draws"] * 1)
            gd = s["gf"] - s["ga"]
            ranking_list.append({
                "team_id": team_id,
                "points": points,
                "gd": gd,
                "wins": s["wins"],
                "losses": s["losses"],
                "gf": s["gf"],
                "ga": s["ga"]
            })

        # 3. Sort by points DESC, then Goal Difference DESC
        ranking_list.sort(key=lambda x: (x["points"], x["gd"]), reverse=True)

        # 4. Upsert into Leaderboard table
        for rank_idx, r in enumerate(ranking_list):
            existing = self.db.query(Leaderboard).filter(
                Leaderboard.tournament_id == tournament_id,
                Leaderboard.team_id == r["team_id"]
            ).first()
            
            rank_pos = rank_idx + 1

            if existing:
                existing.points = r["points"]
                existing.wins = r["wins"]
                existing.losses = r["losses"]
                existing.goals_for = r["gf"]
                existing.goals_against = r["ga"]
                existing.rank = rank_pos
            else:
                new_entry = Leaderboard(
                    tournament_id=tournament_id,
                    team_id=r["team_id"],
                    points=r["points"],
                    wins=r["wins"],
                    losses=r["losses"],
                    goals_for=r["gf"],
                    goals_against=r["ga"],
                    rank=rank_pos
                )
                self.db.add(new_entry)
                
        self.db.commit()

    def get_leaderboard(self, tournament_id: int) -> LeaderboardOut:
        entries = self.db.query(Leaderboard).join(Team).filter(
            Leaderboard.tournament_id == tournament_id
        ).order_by(Leaderboard.rank).all()
        
        out_entries = []
        for e in entries:
            out_entries.append(LeaderboardEntry(
                team_id=e.team_id,
                team_name=e.team.name, # using relationship automatically
                points=e.points,
                wins=e.wins,
                losses=e.losses,
                rank=e.rank
            ))
            
        return LeaderboardOut(tournament_id=tournament_id, entries=out_entries)
