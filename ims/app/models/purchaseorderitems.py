from sqlalchemy import Column,Integer,ForeignKey,Float,DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base
class Purchaseorderitems(Base):
    __tablename__="purchaseorderitems"

    id=Column(Integer,primary_key=True,index=True)
    purchase_order_id=Column(Integer,ForeignKey("purchaseorders.id"))
    product_id=Column(Integer,ForeignKey("products.id"))
    qty=Column(Integer)
    unit_price=Column(Float)
    purchase_order=relationship("PurchaseOrder",back_populates="purchaseorderitems")
    product=relationship("Product",back_populates="purchaseorderitems")
    created_at=Column(DateTime(timezone=True),server_default=func.now())
    updated_at=Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())