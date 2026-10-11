from fastapi import HTTPException,APIRouter,Depends
from sqlalchemy.orm import Session
from typing import List
from app.models.product import Product
from app.models.stocktransactions import Stocktransactions
from app.dependencies import get_db
from app.schemas.stocktransactions import StockCreate,StockResponse,StockUpdate

router=APIRouter(
    prefix="/stocktransactions",
    tags=["stocktransactions"]
)
@router.get("/",response_model=List[StockResponse])
def gettransactions(db:Session=Depends(get_db)):
    tran=db.query(Stocktransactions).all()
    return tran

@router.post("/create_tran",response_model=StockResponse,status_code=201)
def create_tran(stock:StockCreate,db:Session=Depends(get_db)):
    product_id=db.query(Product).filter(Product.id==stock.product_id).first()
    if not product_id:
        raise HTTPException(status_code=404,detail="product not found")
    db_tran=Stocktransactions(
        product_id=stock.product_id,
        type=stock.type,
        qty=stock.qty,
        remarks=stock.remarks
    )
    db.add(db_tran)
    db.commit()
    db.refresh(db_tran)
    return db_tran
@router.put("/{tran_id}",response_model=StockResponse)
def update_tran(tran_id:int,update:StockUpdate,db:Session=Depends(get_db)):
    transactions=db.query(Stocktransactions).filter(Stocktransactions.id==tran_id).first()
    if not transactions:
        raise HTTPException(status_code=404,detail="Stock transactions not found")
    update_stock=update.model_dump(exclude_unset=True)
    for key,value in update_stock.items():
        setattr(transactions,key,value)
    db.commit()
    db.refresh(transactions)
    return transactions

@router.get("/{tran_id}",response_model=StockResponse)
def getstockbyid(tran_id:int,db:Session=Depends(get_db)):
    transactions=db.query(Stocktransactions).filter(Stocktransactions.id==tran_id).first()
    if not transactions:
        raise HTTPException(status_code=404,detail="Stock transactions not found")
    return transactions

@router.delete("/{tran_id}")
def stock_delete(tran_id:int,db:Session=Depends(get_db)):
    transactions=db.query(Stocktransactions).filter(Stocktransactions.id==tran_id).first()
    if not transactions:
        raise HTTPException(status_code=404,detail="Stock transactions not found")
    db.delete(transactions)
    db.commit()
    return {"stocktransactions Deleted"}

