from enum import Enum
from sqlalchemy import Column,Integer,Float,String,DateTime,Enum as SqlEnum,ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.purchasestatus import Purchasestatus
from app.database.database import Base
class PurchaseOrder(Base):
    __tablename__="purchaseorders"

    id=Column(Integer,primary_key=True,index=True)
    supplier_id=Column(Integer,ForeignKey("suppliers.id"))
    status=Column(SqlEnum(Purchasestatus),default=Purchasestatus.PENDING,nullable=True)
    total_amount=Column(Float,default=0)
    supplier=relationship("Supplier",back_populates="purchaseorders")
    purchaseorderitems=relationship("Purchaseorderitems",back_populates="purchase_order")
    created_at=Column(DateTime(timezone=True),server_default=func.now())
    updated_at=Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())