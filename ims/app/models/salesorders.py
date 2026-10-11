from enum import Enum
from sqlalchemy import Column,Integer,String,DateTime,Enum as SqlEnum,Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base
from app.models.salesstatus import Salesstatus 
class Salesorders(Base):
    __tablename__="salesorders"

    id=Column(Integer,primary_key=True,index=True)
    cust_name=Column(String(100),nullable=True)
    status=Column(SqlEnum(Salesstatus),default=Salesstatus.PENDING,nullable=True)
    total_amount=Column(Float)
    salesorderitems=relationship("Salesorderitems",back_populates="sales_order")
    created_at=Column(DateTime(timezone=True),server_default=func.now())
    updated_at=Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())