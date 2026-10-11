from enum import Enum
from sqlalchemy import Column,String,Integer,DateTime,ForeignKey,Enum as SqlEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base 
from app.models.stocktrantype import StockType
class Stocktransactions(Base):
    __tablename__="stocktransactions"

    id=Column(Integer,primary_key=True,index=True)
    product_id=Column(Integer,ForeignKey("products.id"))
    type=Column(SqlEnum(StockType),default=StockType.IN,nullable=False)
    qty=Column(Integer)
    remarks=Column(String(100),nullable=True)
    product=relationship("Product",back_populates="stocktransactions")
    created_at=Column(DateTime(timezone=True),server_default=func.now())
    updated_at=Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())


