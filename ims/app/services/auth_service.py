from fastapi import Depends,APIRouter,HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.user import User
from app.schemas.user import UserCreate,UserResponse,UserLogin,UserUpdate
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import hash_password,verify_password,create_access_token
from app.logging_config import logger


def register(user:UserCreate,db:Session):
    try:
        existing_user=db.query(User).filter(User.email==user.email).first()
        if existing_user:
            raise HTTPException(status_code=400,detail="User already exists")
        hashed_password=hash_password(user.password)
        db_user=User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        role=user.role)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logger.info(f"user '{db_user.email}'registered successfully")
        return db_user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print("REGISTER ERROR:", repr(e))
        raise


def login(formdata:OAuth2PasswordRequestForm,db:Session):
    try:
        db_user=db.query(User).filter(User.email==formdata.username).first()
        if not db_user:
            logger.warning(f"Invalid login attempt for {formdata.username}")
            raise HTTPException(status_code=401,detail="Invalid Credentials")
        if not verify_password(formdata.password,db_user.password):
            raise HTTPException(status_code=401,detail="Invalid Credentials")
        access_token=create_access_token({"sub":db_user.email})
        logger.info(f"User {db_user.email} logged in successfully")
        return {"access_token":access_token,"token_type":"bearer"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print("REGISTER ERROR:", repr(e))
        raise
