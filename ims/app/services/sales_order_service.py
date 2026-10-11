from fastapi import HTTPException,Depends,APIRouter
from sqlalchemy.orm import Session
from app.models.salesorders import Salesorders
from app.dependencies import get_db
from app.schemas.sales_order import Sales_order_create,SalesResponse,SalesUpdate
from typing import List
from app.models.purchasestatus import Purchasestatus
from app.models.salesorderitems import Salesorderitems
from app.models.product import Product
from app.models.stocktransactions import Stocktransactions
from app.models.stocktrantype import StockType
from app.models.salesstatus import Salesstatus
from app.logging_config import logger



def getSalesorders(db:Session):
    try:
        so=db.query(Salesorders).all()
        return so
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to get Sales Orders:{str(e)}")
        raise HTTPException(status_code=500,detail="Failed to Get Sales Orders")

def createso(so:Sales_order_create,db:Session):
    try:
        create_so=Salesorders(cust_name=so.cust_name,status=so.status,total_amount=so.total_amount)
        db.add(create_so)
        db.commit()
        db.refresh(create_so)
        logger.info("Sales Order Created Successfully")
        return create_so
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to Create Sales Order")
        raise HTTPException(status_code=500,detail="Failed to Create Sales Order")


def update_so(so_id:int,update:SalesUpdate,db:Session):
    try:
        sales_id=db.query(Salesorders).filter(Salesorders.id==so_id).first()
        if not sales_id:
            raise HTTPException(status_code=404,detail="Sales Order is not found")
        update_sales=update.model_dump(exclude_unset=True)
        for key,value in update_sales.items():
            setattr(sales_id,key,value)
        db.commit()
        db.refresh(sales_id)
        return sales_id
    except HTTPException:
        raise 
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to Update Sales Order:{str(e)}")
        raise HTTPException(status_code=500,detail="Failed to Update Sales Order")
    
def getsobyid(so_id:int,db:Session):
    try:
        sales_id=db.query(Salesorders).filter(Salesorders.id==so_id).first()
        if not sales_id:
            raise HTTPException(status_code=404,detail="Sales Order is not found")
        return sales_id
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to get Sales Order ID")
        raise HTTPException(status_code=500,detail="Failed to get Sales Order ID")

def delete_so(so_id:int,db:Session):
    try:
        sales_id=db.query(Salesorders).filter(Salesorders.id==so_id).first()
        if not sales_id:
            raise HTTPException(status_code=404,detail="Sales Order is not found")
        db.delete(sales_id)
        db.commit()
        return {"Sales Order Id Deleted"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"failed to Delete Sales order")
        raise HTTPException(status_code=500,detail="failed to Delete Sales Order")

def update_sales(sales_order_id:int,db:Session):
    try:
        so=db.query(Salesorders).filter(Salesorders.id==sales_order_id).first()
        if not so:
            raise HTTPException(status_code=400,detail="No sales orders yet")
        if so.status==Salesstatus.COMPLETED:
            raise HTTPException(status_code=400,detail="sales order is already received")
        so_items=db.query(Salesorderitems).filter(Salesorderitems.sales_order_id==sales_order_id).all()
        if not so_items:
            raise HTTPException(status_code=400,detail="Sales Order Items is empty")
        for item in so_items:
            product=db.query(Product).filter(Product.id==item.product_id).first()
            if not product:
               raise HTTPException(status_code=404,detail="no product in sales order")
            if product.qty<item.qty:
               raise HTTPException(status_code=400,detail=f"Insufficient stock for {product.name}")
            product.qty=product.qty-item.qty
            stock=Stocktransactions(
            product_id=item.product_id,
            type=StockType.OUT,
            qty=item.qty,
            remarks=f"Sales Order #{sales_order_id}")
            db.add(stock)
        so.status=Salesstatus.COMPLETED
        db.commit()
        logger.info(f"Sales Order #{sales_order_id} completed successfully")
        db.refresh(so)    
        return so
    except HTTPException:
        raise
    except Exception as e:
            db.rollback()
            logger.error(f"Failed to complete Sales Order #{sales_order_id}: {str(e)}")   
        
        
