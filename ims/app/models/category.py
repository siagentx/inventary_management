from sqlalchemy import Column,Integer,String,DateTime
from sqlalchemy.sql import func
from app.database.database import Base
from sqlalchemy.orm import relationship 
class Category(Base):
    __tablename__="categories"

    id=Column(Integer,primary_key=True,index=True)
    name=Column(String(100),nullable=False)
    products=relationship("Product",back_populates="category")
    created_at=Column(DateTime(timezone=True),server_default=func.now())
    updated_at=Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())
