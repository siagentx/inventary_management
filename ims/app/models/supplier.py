from sqlalchemy import Column,Integer,String,DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base

class Supplier(Base):
    __tablename__="suppliers"

    id=Column(Integer,primary_key=True,index=True)
    company=Column(String(100),nullable=False)
    contact=Column(String(100),nullable=False)
    email=Column(String(100),unique=True,nullable=False)
    phone=Column(String(100),nullable=False)
    products=relationship("Product",back_populates="supplier")
    purchaseorders=relationship("PurchaseOrder",back_populates="supplier")
    created_at=Column(DateTime(timezone=True),server_default=func.now())
    updated_at=Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())