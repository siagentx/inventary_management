from fastapi import HTTPException,Depends,APIRouter
from sqlalchemy.orm import Session
from app.dependencies import get_db
from typing import List
from app.models.product import Product
from app.models.purchaseorders import PurchaseOrder
from app.models.purchaseorderitems import Purchaseorderitems
from app.schemas.purchaseorderitem import PurchaseOrderCreate,PurchaseOrderResponse,PurchaseOrderUpdate

router=APIRouter(
    prefix="/purchaseorderitems",
    tags=["po items"]
)

@router.get("/",response_model=List[PurchaseOrderResponse])
def getpoitems(db:Session=Depends(get_db)):
    po=db.query(Purchaseorderitems).all()
    return po

@router.post("/create_po_items",response_model=PurchaseOrderResponse,status_code=201)
def create_po_item(po:PurchaseOrderCreate,db:Session=Depends(get_db)):
    product=db.query(Product).filter(Product.id==po.product_id).first()
    if not product:
        raise HTTPException(status_code=404,detail="Product not found")
    purchase=db.query(PurchaseOrder).filter(PurchaseOrder.id==po.purchase_order_id).first()
    if not purchase:
        raise HTTPException(status_code=404,detail="PO not Found")
    db_po=Purchaseorderitems(
        product_id=po.product_id,
        purchase_order_id=po.purchase_order_id,
        qty=po.qty,
        unit_price=po.unit_price
    )
    db.add(db_po)
    db.commit()
    db.refresh(db_po)
    return db_po
@router.put("/{po_id}",response_model=PurchaseOrderResponse)
def update_po(po_id:int,update:PurchaseOrderUpdate,db:Session=Depends(get_db)):
    po=db.query(Purchaseorderitems).filter(Purchaseorderitems.id==po_id).first()
    if not po:
        raise HTTPException(status_code=404,detail="PO not found")
    po_update=update.model_dump(exclude_unset=True)
    for key,value in po_update.items():
        setattr(po,key,value)
    db.commit()
    db.refresh(po)    
    return po
@router.get("/{po_id}",response_model=PurchaseOrderResponse)
def getpobyid(po_id:int,db:Session=Depends(get_db)):
    po=db.query(Purchaseorderitems).filter(Purchaseorderitems.id==po_id).first()
    if not po:
        raise HTTPException(status_code=404,detail="PO not found")
    return po
@router.delete("/{po_id}")
def deletepobyid(po_id:int,db:Session=Depends(get_db)):
    po=db.query(Purchaseorderitems).filter(Purchaseorderitems.id==po_id).first()
    if not po:
        raise HTTPException(status_code=404,detail="PO not found")
    db.delete(po)
    db.commit()
    return {"PO Item Deleted"}

