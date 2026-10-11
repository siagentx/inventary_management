from fastapi import HTTPException,Depends,APIRouter
from sqlalchemy.orm import Session
from typing import List
from app.models.supplier import Supplier
from app.models.purchaseorders import PurchaseOrder
from app.schemas.purchaseorder import PurchaseCreate,PurchaseResponse,PurchaseUpdate
from app.dependencies import get_db
from app.models.purchasestatus import Purchasestatus
from app.models.purchaseorderitems import Purchaseorderitems
from app.models.product import Product
from app.models.stocktransactions import Stocktransactions
from app.models.stocktrantype import StockType
from app.logging_config import logger
from app.tasks import send_purchase_order_email

def getpurchases(db:Session):
    try:
        purchase=db.query(PurchaseOrder).all()
        return purchase
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to get Purchase Orders:{str(e)}")
        raise HTTPException(status_code=500,detail="Failed to get Purchase Orders")


def create_purchase(purchase: PurchaseCreate, db: Session):
    try:

        # Check Supplier
        supplier = (
            db.query(Supplier)
            .filter(Supplier.id == purchase.supplier_id)
            .first()
        )

        if not supplier:
            raise HTTPException(
                status_code=404,
                detail="Supplier not found"
            )

        # Create Purchase Order
        db_purchase = PurchaseOrder(
            supplier_id=purchase.supplier_id
        )

        db.add(db_purchase)

        # Generate Purchase Order ID without commit
        db.flush()

        total = 0

        # Create Purchase Order Items
        for item in purchase.items:

            product = (
                db.query(Product)
                .filter(Product.id == item.product_id)
                .first()
            )

            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product {item.product_id} not found"
                )

            db_item = Purchaseorderitems(
                purchase_order_id=db_purchase.id,
                product_id=item.product_id,
                qty=item.qty,
                unit_price=product.price
            )

            db.add(db_item)

            total += item.qty * product.price

        # Update Total Amount
        db_purchase.total_amount = total

        db.commit()

        db.refresh(db_purchase)
        logger.info(f"📦 Purchase Order #{db_purchase.id} created")
        logger.info("🚀 Sending Purchase Order email task to Celery...")
        task=send_purchase_order_email.delay(db_purchase.id)
        logger.info(f"✅ Celery task queued: {task.id}")
        logger.info(f"Purchase Order #{db_purchase.id} Created Successfully")

        return db_purchase

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()

        logger.error(f"Failed to Create Purchase Order: {str(e)}")

        raise HTTPException(
            status_code=500,
            detail="Failed to Create Purchase Order"
        )

def update_purchase(purchase_id:int,update:PurchaseUpdate,db:Session):
    try:
        purchase=db.query(PurchaseOrder).filter(purchase_id==PurchaseOrder.id).first()
        if not purchase:
           raise HTTPException(status_code=404,detail="Purchase Order not found")
        update_purchase=update.model_dump(exclude_unset=True)
        for key,value in update_purchase.items():
            setattr(purchase,key,value)
        db.commit()
        db.refresh(purchase)
        logger.info("Purchase Order Updated Successfully")
        return purchase
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to Update Purchase Order")
        raise HTTPException(status_code=500,detail="Failed to Update Purchase Order")

def purchase_status(purchase_order_id:int,db:Session):
    try:
        po_id=db.query(PurchaseOrder).filter(PurchaseOrder.id==purchase_order_id).first()
        po_items=db.query(Purchaseorderitems).filter(Purchaseorderitems.purchase_order_id==purchase_order_id).all()
        if not po_id:
            raise HTTPException(status_code=404,detail="Purchase Order Id not found")
        if po_id.status==Purchasestatus.RECEIVED:
            raise HTTPException(status_code=400,detail="Purchase order Received")
        if not po_items:
            raise HTTPException(status_code=404,detail="purchase orders has no items")
        for item in po_items:
            product=db.query(Product).filter(Product.id==item.product_id).first()
            if not product:
                raise HTTPException(status_code=404,detail="Product not found")
            product.qty=product.qty+item.qty
            stock=Stocktransactions(
            product_id=item.product_id,
            type=StockType.IN,
            qty=item.qty,
            remarks=f"Purchase Order #{purchase_order_id}")
            db.add(stock)   
        po_id.status=Purchasestatus.RECEIVED
        db.commit()
        logger.info(f"Purchase Order #{purchase_order_id} received successfully")
        db.refresh(po_id)    
        return po_id
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to receive Purchase Order #{purchase_order_id}: {str(e)}")
        raise HTTPException(status_code=500,detail="Failed to receive Purchase Order")


def getpobyid(purchase_id:int,db:Session=Depends(get_db)):
    try:
        purchase=db.query(PurchaseOrder).filter(purchase_id==PurchaseOrder.id).first()
        if not purchase:
            raise HTTPException(status_code=404,detail="Purchase Order not found")
        return purchase
    except HTTPException:
        db.rollback()
        logger.error(f"Failed to get Purchase Order")
        raise HTTPException(status_code=500,detail="Failed to get Purchase Order")


def deletepo(purchase_id:int,db:Session):
    try:
        purchase=db.query(PurchaseOrder).filter(purchase_id==PurchaseOrder.id).first()
        if not purchase:
           raise HTTPException(status_code=404,detail="Purchase Order not found")
        db.delete(purchase)
        db.commit()
        logger.info("Purchase Order Deleted")
        return {"PO Deleted"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to Delete PO:{str(e)}")
        raise HTTPException(status_code=500,detail="Failed to Delete PO")