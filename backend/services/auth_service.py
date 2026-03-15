from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repositories.user_repository import UserRepository
from schemas.user import UserCreate, UserLogin
from utils.security import get_password_hash, verify_password, create_access_token

class AuthService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def register_user(self, user_data: UserCreate):
        # Check if email is already taken
        existing_user = self.repository.get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        
        # Hash password and create user
        hashed_password = get_password_hash(user_data.password)
        created_user = self.repository.create_user(user_data, hashed_password)
        return created_user

    def login_user(self, credentials: UserLogin):
        user = self.repository.get_user_by_email(credentials.email)
        if not user or not verify_password(credentials.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
        # Create token
        access_token = create_access_token(user_id=user.id, user_role=user.role.value)
        return {"access_token": access_token, "token_type": "bearer"}
