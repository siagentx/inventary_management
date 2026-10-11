from fastapi import Depends,APIRouter
from sqlalchemy.orm import Session
from typing import List
from app.services import dashboard_service
from app.schemas.product import ProductResponse
from app.dependencies import get_db
router=APIRouter(
    prefix="/dashboard",
    tags=["dashboard"]
)

@router.get("/summary")
def total_products(db:Session=Depends(get_db)):
    return dashboard_service.total_products(db)
@router.get("/low-stock",response_model=List[ProductResponse])
def low_stock(db:Session=Depends(get_db)):
    return dashboard_service.low_stock(db)

@router.get("/out-of-stock")
def outofstock(db:Session=Depends(get_db)):
    return dashboard_service.outofstock(db)

@router.get("/recent-transactions")
def recent_transactions(db:Session=Depends(get_db)):
    return dashboard_service.recent_transactions(db)

@router.get("/top-selling-products")
def topproduct(db:Session=Depends(get_db)):
    return dashboard_service.topproduct(db)