from fastapi import APIRouter,HTTPException,Depends
from sqlalchemy.orm import Session
from typing import List
from app.models.salesorderitems import Salesorderitems
from app.models.salesorders import Salesorders
from app.models.product import Product
from app.schemas.salesorderitem import CreateSOItem,UpdateSOItem,ResponseSOItem
from app.dependencies import get_db

router=APIRouter(
    prefix="/so_item",
    tags=["so_item"]
)

@router.get("/",response_model=List[ResponseSOItem])
def getsoitem(db:Session=Depends(get_db)):
    so=db.query(Salesorderitems).all()
    return so
@router.post("/create_so_item",response_model=ResponseSOItem,status_code=201)
def create_so(so:CreateSOItem,db:Session=Depends(get_db)):
    sales_id=db.query(Salesorders).filter(Salesorders.id==so.sales_order_id).first()
    if not sales_id:
        raise HTTPException(status_code=404,detail="Sales Order not found")
    product_id=db.query(Product).filter(Product.id==so.product_id).first()
    if not product_id:
        raise HTTPException(status_code=404,detail="Product not found")
    db_so_item=Salesorderitems(
        sales_order_id=so.sales_order_id,
        product_id=so.product_id,
        qty=so.qty,
        unit_price=so.unit_price
    )
    db.add(db_so_item)
    db.commit()
    db.refresh(db_so_item)
    return db_so_item
@router.put("/{so_id}",response_model=ResponseSOItem)
def update_so(so_id:int,update_so:UpdateSOItem,db:Session=Depends(get_db)):
    sales_id=db.query(Salesorderitems).filter(Salesorderitems.id==so_id).first()
    if not sales_id:
        raise HTTPException(status_code=404,detail="SO Item not found")
    sales_update=update_so.model_dump(exclude_unset=True)
    for key,value in sales_update.items():
        setattr(sales_id,key,value)
    db.commit()
    db.refresh(sales_id)
    return sales_id
@router.get("/{so_id}",response_model=ResponseSOItem)
def update_so(so_id:int,db:Session=Depends(get_db)):
    sales_id=db.query(Salesorderitems).filter(Salesorderitems.id==so_id).first()
    if not sales_id:
        raise HTTPException(status_code=404,detail="SO Item not found")   
    return sales_id
@router.delete("/{so_id}")
def delete_so(so_id:int,db:Session=Depends(get_db)):
    sales_id=db.query(Salesorderitems).filter(Salesorderitems.id==so_id).first()
    if not sales_id:
        raise HTTPException(status_code=404,detail="SO Item not found")
    db.delete(sales_id)
    db.commit()
    return {"Sales Order Item Deleted"}
