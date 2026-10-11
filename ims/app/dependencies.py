from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.core.security import (
    oauth2_scheme,
    decode_access_token
)
from app.models.user import User

from enum import Enum
from app.models.userrole import UserRole

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme),db: Session = Depends(get_db)):

    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid token")

    email = payload.get("sub")

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="User not found")
    
    return user
def get_current_admin(current_user: User = Depends(get_current_user)):
   
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return current_user
