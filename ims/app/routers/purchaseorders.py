from fastapi import Depends,APIRouter
from sqlalchemy.orm import Session
from typing import List
from app.schemas.purchaseorder import PurchaseCreate,PurchaseResponse,PurchaseUpdate
from app.dependencies import get_db
from app.services import purchase_order_service

router=APIRouter(
    prefix="/purchase_orders",
    tags=["purchaseorders"]
)
@router.get("/",response_model=List[PurchaseResponse])
def getpurchases(db:Session=Depends(get_db)):
    return purchase_order_service.getpurchases(db)

@router.post("/create_purchase",response_model=PurchaseResponse,status_code=201)
def create_purchase(purchase:PurchaseCreate,db:Session=Depends(get_db)):
    return purchase_order_service.create_purchase(purchase,db)

@router.put("/{purchase_id}",response_model=PurchaseResponse)
def update_purchase(purchase_id:int,update:PurchaseUpdate,db:Session=Depends(get_db)):
    return purchase_order_service.update_purchase(purchase_id,update)

@router.put("/{purchase_order_id}/receive",response_model=PurchaseResponse)
def purchase_status(purchase_order_id:int,db:Session=Depends(get_db)):
    return purchase_order_service.purchase_status(purchase_order_id,db)

@router.get("/{purchase_id}",response_model=PurchaseResponse)
def getpobyid(purchase_id:int,db:Session=Depends(get_db)):
    return purchase_order_service.getpobyid(purchase_id,db)

@router.delete("/{purchase_id}")
def deletepo(purchase_id:int,db:Session=Depends(get_db)):
    return purchase_order_service.deletepo(purchase_id,db)
