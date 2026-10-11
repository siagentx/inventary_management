from sqlalchemy import Column,Integer,String,DateTime,Float
from sqlalchemy.sql import func
from app.database.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
class Product(Base):
    __tablename__="products"

    id=Column(Integer,primary_key=True,index=True)
    sku=Column(String(100),nullable=False)
    name=Column(String(100),nullable=False)
    category_id=Column(Integer,ForeignKey("categories.id"))
    supplier_id=Column(Integer,ForeignKey("suppliers.id"))
    price=Column(Float)
    qty=Column(Integer)
    category=relationship("Category",back_populates="products")
    supplier=relationship("Supplier",back_populates="products")
    purchaseorderitems=relationship("Purchaseorderitems",back_populates="product")
    salesorderitems=relationship("Salesorderitems",back_populates="product")
    stocktransactions=relationship("Stocktransactions",back_populates="product")
    created_at=Column(DateTime(timezone=True),server_default=func.now())
    updated_at=Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())

