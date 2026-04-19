from database import SessionLocal
from utils.security import get_password_hash
from models.user import User, UserRole

def seed_users():
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.email == "admin@tourna.com").first():
            db.add(User(name="Admin Server", email="admin@tourna.com", password_hash=get_password_hash("admin123"), role=UserRole.ADMIN))
        if not db.query(User).filter(User.email == "org@tourna.com").first():
            db.add(User(name="Organizer Pro", email="org@tourna.com", password_hash=get_password_hash("org123"), role=UserRole.ORGANIZER))
        if not db.query(User).filter(User.email == "captain@tourna.com").first():
            db.add(User(name="Team Captain", email="captain@tourna.com", password_hash=get_password_hash("captain123"), role=UserRole.TEAM_CAPTAIN))
        if not db.query(User).filter(User.email == "player@tourna.com").first():
            db.add(User(name="Striker", email="player@tourna.com", password_hash=get_password_hash("player123"), role=UserRole.PLAYER))
        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
    print("Database successful seeded with initial roles.")
