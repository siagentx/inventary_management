from pydantic import BaseModel,EmailStr
from typing import Optional
from datetime import datetime
from app.models.userrole import UserRole
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role:UserRole


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: UserRole
    created_at:datetime
    updated_at:datetime
    class Config:
        from_attributes = True

    
class UserUpdate(BaseModel):
    username:Optional[str]=None
    email:Optional[EmailStr]=None
    password:Optional[str]=None
    role:Optional[UserRole]=None

class UserLogin(BaseModel):
    email:EmailStr
    password:str    