from enum import Enum
from sqlalchemy import Column,Integer,String,DateTime,Enum as SqlEnum 
from sqlalchemy.sql import func
from app.database.database import Base
from app.models.userrole import UserRole

class User(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True,index=True)

    username = Column(String(100),nullable=False)
    email = Column(String(150),unique=True,nullable=False,index=True)
    password = Column(String(255),nullable=False)
    role = Column(SqlEnum(UserRole),default=UserRole.STAFF,nullable=False)
    created_at=Column(DateTime(timezone=True),server_default=func.now())
    updated_at=Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())