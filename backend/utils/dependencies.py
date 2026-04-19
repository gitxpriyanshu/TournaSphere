from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from database import get_db
from models.user import UserRole
from repositories.user_repository import UserRepository

from utils.security import SECRET_KEY, ALGORITHM

# We use the /api/auth/login endpoint for token URL if someone uses Swagger UI
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
        user_id = int(user_id_str)
    except JWTError:
        raise credentials_exception
        
    repo = UserRepository(db)
    user = repo.get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
    return user

def require_admin(current_user = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return current_user

def require_organizer(current_user = Depends(get_current_user)):
    if current_user.role not in [UserRole.ORGANIZER, UserRole.ADMIN]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Organizer privileges required")
    return current_user

def require_captain(current_user = Depends(get_current_user)):
    if current_user.role not in [UserRole.TEAM_CAPTAIN, UserRole.ORGANIZER, UserRole.ADMIN]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Team Captain privileges required")
    return current_user
