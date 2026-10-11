from fastapi import Depends,APIRouter
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas.sales_order import Sales_order_create,SalesResponse,SalesUpdate
from typing import List

from app.logging_config import logger
from app.services import sales_order_service
router=APIRouter(
    prefix="/salesorder",
    tags=["Salesorders"]
)

@router.get("/",response_model=List[SalesResponse])
def getSalesorders(db:Session=Depends(get_db)):
    return sales_order_service.getSalesorders(db)

@router.post("/createso",response_model=SalesResponse,status_code=201)
def createso(so:Sales_order_create,db:Session=Depends(get_db)):
    return sales_order_service.createso(so,db)

@router.put("/{so_id}",response_model=SalesResponse)
def update_so(so_id:int,update:SalesUpdate,db:Session=Depends(get_db)):
    return sales_order_service.update_so(so_id,update,db)

@router.get("/{so_id}",response_model=SalesResponse)
def getsobyid(so_id:int,db:Session=Depends(get_db)):
    return sales_order_service.getsobyid(so_id,db)

@router.delete("/{so_id}") 
def delete_so(so_id:int,db:Session=Depends(get_db)):
    return sales_order_service.delete_so(so_id,db)

@router.put("/{sales_order_id}/complete",response_model=SalesResponse)
def update_sales(sales_order_id:int,db:Session=Depends(get_db)):
    return sales_order_service.update_sales(sales_order_id,db)
        
        
