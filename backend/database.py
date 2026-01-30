from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/tournasphere")

# SQLAlchemy Engine
# The engine is the starting point for any SQLAlchemy application.
# It's "where" the database lives.
engine = create_engine(DATABASE_URL)

# SessionLocal class
# Each instance of the SessionLocal class will be a database session.
# The class itself is not a session yet.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class
# We will use this class to create each of the database models or classes (the ORM models).
Base = declarative_base()

def create_all_tables():
    from models import user, tournament, team, player, match, match_result, leaderboard
    Base.metadata.create_all(bind=engine)

def get_db():
    """
    Dependency to get a database session.
    The session will be closed after the request is finished.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
