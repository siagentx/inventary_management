from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db
from app.schemas.supplier import SupplierCreate,SupplierResponse,SupplierUpdate
from app.services import supplier_service
router=APIRouter(
    prefix="/suppliers",
    tags=["suppliers"]
)

@router.get("/",response_model=List[SupplierResponse])
def getsuppliers(db:Session=Depends(get_db)):
    return supplier_service.getsuppliers(db)

@router.post("/create_supplier",response_model=SupplierResponse,status_code=201)
def createsupplier(supplier:SupplierCreate,db:Session=Depends(get_db)):
    return supplier_service.createsupplier(supplier,db)
@router.get("/{supplier_id}",response_model=SupplierResponse)
def getsupplierbyid(supplier_id:int,db:Session=Depends(get_db)):
    return supplier_service.getsupplierbyid(supplier_id,db)

@router.put("/{supplier_id}",response_model=SupplierResponse)
def update_supplier(supplier_id:int,update:SupplierUpdate,db:Session=Depends(get_db)):
    return supplier_service.update_supplier(supplier_id,update,db)

@router.delete("/{supplier_id}")
def del_supplier(supplier_id:int,db:Session=Depends(get_db)):
    return supplier_service.del_supplier(supplier_id,db)

