from fastapi import HTTPException,Depends,APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.models.product import Product
from app.models.supplier import Supplier
from app.models.purchaseorders import PurchaseOrder
from app.models.salesorders import Salesorders
from app.schemas.product import ProductResponse
from app.models.stocktransactions import Stocktransactions
from app.models.salesorderitems import Salesorderitems
from app.dependencies import get_db
from app.logging_config import logger


def total_products(db:Session):
    try:
        tot_prod=db.query(Product).count()
        tot_suppliers=db.query(Supplier).count()
        tot_purchase_orders=db.query(PurchaseOrder).count()
        tot_sales_orders=db.query(Salesorders).count()
        total_inventory_value=db.query(func.sum(Product.qty*Product.price)).scalar() or 0
        return {"total_products": tot_prod,
             "total_suppliers":tot_suppliers,
             "total_purchase_orders":tot_purchase_orders,
             "total_sales_orders":tot_sales_orders,
             "total":total_inventory_value or 0
            }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"failed to get total products:{str(e)}")
        raise HTTPException(status_code=500,detail="failed to get total products")
    

def low_stock(db:Session):
    try:
        low=db.query(Product).filter(Product.qty<10).all()
        return low
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to get Low stock:{str(e)}")
        raise HTTPException(status_code=500,detail="Failed to get Low stock")


def outofstock(db:Session):
    try:
        outof_s=db.query(Product).filter(Product.qty==0).all()
        return{"out_of_stock":outof_s}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to get Outofstock:{str(e)}")
        raise HTTPException(status_code=500,detail="Failed to get Outofstock")


def recent_transactions(db:Session):
    try:
        recent=db.query(Stocktransactions).order_by(Stocktransactions.created_at.desc()).limit(10).all()
        return {"recent_transactions":[{"product_id":item.product_id,"qty":item.qty}for item in recent]}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to get Recent transactions:{str(e)}")
        raise HTTPException(status_code=500,detail="Failed to get Recent transactions")

def topproduct(db:Session):
    try:
        top=db.query(Product.name,func.sum(Salesorderitems.qty).label("total_qty_sold")).join(Product,Salesorderitems.product_id==Product.id).group_by(Product.name).order_by(
        func.sum(Salesorderitems.qty).desc()).all()
        return {"top_selling_product":[{"product_name":item.name,"total_qty":item.total_qty_sold}for item in top]}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to get Top selling Products:{str(e)}")
        raise HTTPException(status_code=500,detail="Failed to get Top selling Products")