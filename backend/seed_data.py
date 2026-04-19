from database import SessionLocal
from models.user import User, UserRole
from models.tournament import Tournament, TournamentStatus
from models.team import Team, TeamStatus
from utils.security import get_password_hash
from datetime import datetime, timedelta

def run_seed():
    db = SessionLocal()
    
    # 1. Ensure we have an admin and an organizer
    admin = db.query(User).filter(User.email == "admin@tourna.com").first()
    if not admin:
        admin = User(name="Admin", email="admin@tourna.com", password_hash=get_password_hash("admin123"), role=UserRole.ADMIN)
        db.add(admin)
        db.commit()
    
    organizer = db.query(User).filter(User.email == "organizer@tourna.com").first()
    if not organizer:
        organizer = User(name="Orion Org", email="organizer@tourna.com", password_hash=get_password_hash("org123"), role=UserRole.ORGANIZER)
        db.add(organizer)
        db.commit()

    captain1 = db.query(User).filter(User.email == "captain1@tourna.com").first()
    if not captain1:
        captain1 = User(name="Captain Alpha", email="captain1@tourna.com", password_hash=get_password_hash("cap123"), role=UserRole.TEAM_CAPTAIN)
        db.add(captain1)
        db.commit()

    captain2 = db.query(User).filter(User.email == "captain2@tourna.com").first()
    if not captain2:
        captain2 = User(name="Captain Beta", email="captain2@tourna.com", password_hash=get_password_hash("cap123"), role=UserRole.TEAM_CAPTAIN)
        db.add(captain2)
        db.commit()

    # 2. Check if we already have tournaments to prevent duplicates
    if db.query(Tournament).count() == 0:
        print("Injecting master configurations...")
        
        t1 = Tournament(
            name="Global Esports Championship 2026",
            sport_type="Esports",
            start_date=datetime.utcnow() + timedelta(days=5),
            end_date=datetime.utcnow() + timedelta(days=12),
            status=TournamentStatus.UPCOMING,
            created_by=admin.id
        )

        t2 = Tournament(
            name="Silicon Valley Tech League",
            sport_type="Basketball",
            start_date=datetime.utcnow() - timedelta(days=2),
            end_date=datetime.utcnow() + timedelta(days=10),
            status=TournamentStatus.ONGOING,
            created_by=admin.id
        )

        t3 = Tournament(
            name="Alpha Strike Division",
            sport_type="Tactical Simulation",
            start_date=datetime.utcnow() - timedelta(days=30),
            end_date=datetime.utcnow() - timedelta(days=10),
            status=TournamentStatus.COMPLETED,
            created_by=admin.id
        )

        db.add_all([t1, t2, t3])
        db.commit()
        db.refresh(t1)
        db.refresh(t2)

        print("Master configurations injected successfully.")

        # 3. Add Teams to Ongoing tournament
        team1 = Team(name="Neon Strikers", tournament_id=t2.id, captain_id=captain1.id, status=TeamStatus.APPROVED)
        team2 = Team(name="Void Runners", tournament_id=t2.id, captain_id=captain2.id, status=TeamStatus.APPROVED)
        
        db.add_all([team1, team2])
        db.commit()
        print("Team allocations locked in.")

    else:
        print("Database already populated with configurations.")
        
    db.close()

if __name__ == "__main__":
    run_seed()
