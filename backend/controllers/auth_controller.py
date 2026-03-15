from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.user import UserCreate, UserOut, UserLogin, TokenOut
from services.auth_service import AuthService

router = APIRouter()

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """ Register a new user """
    service = AuthService(db)
    return service.register_user(user_data)

@router.post("/login", response_model=TokenOut)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """ Authenticate user and return JWT token """
    service = AuthService(db)
    return service.login_user(credentials)
