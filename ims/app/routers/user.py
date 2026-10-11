from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from app.models.user import User
from typing import List
from fastapi import HTTPException
from app.schemas.user import (UserResponse,UserUpdate)
from app.dependencies import get_current_admin,get_db,get_current_user
router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/",response_model=List[UserResponse])
def getUsers(db:Session=Depends(get_db),current_admin:User=Depends(get_current_admin)):
    users=db.query(User).all()
    return users

@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/admin")
def admin_dashboard(admin: User = Depends(get_current_admin)):
    return {"message": f"Welcome Admin {admin.username}"}

@router.get("/{user_id}",response_model=UserResponse)
def getUsers(user_id:int,db:Session=Depends(get_db)):
    user=db.query(User).filter(User.id==user_id).first()
    if user is None:
        raise HTTPException(status_code=404,detail="user not found")
    return user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int,user: UserUpdate,db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()

    if db_user is None:
        raise HTTPException(status_code=404,detail="User not found")

    update_data = user.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)

    return db_user

@router.delete("/{user_id}")
def delete_user(user_id:int,db:Session=Depends(get_db)):
    db_user=db.query(User).filter(User.id==user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404,detail="user not found")
    db.delete(db_user)
    db.commit()
    return {"message":"user deleted successfully"}

