from sqlalchemy import Column,String,Integer,ForeignKey,DateTime,Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base
class Salesorderitems(Base):
    __tablename__="salesorderitems"

    id=Column(Integer,primary_key=True,index=True)
    sales_order_id=Column(Integer,ForeignKey("salesorders.id"))
    product_id=Column(Integer,ForeignKey("products.id"))
    qty=Column(Integer)
    unit_price=Column(Float)
    sales_order=relationship("Salesorders",back_populates="salesorderitems")
    product=relationship("Product",back_populates="salesorderitems")
    created_at=Column(DateTime(timezone=True),server_default=func.now())
    updated_at=Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())