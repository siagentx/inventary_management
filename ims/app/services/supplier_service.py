from fastapi import HTTPException,APIRouter,Depends
from sqlalchemy.orm import Session
from app.models.supplier import Supplier
from typing import List
from app.dependencies import get_db
from app.schemas.supplier import SupplierCreate,SupplierResponse,SupplierUpdate
from app.logging_config import logger
router=APIRouter(
    prefix="/suppliers",
    tags=["suppliers"]
)


def getsuppliers(db:Session):
    try:
        suppliers=db.query(Supplier).all()
        return suppliers
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"suppliers not found:{str(e)}")
        raise HTTPException(status_code=404,detail="suppliers not found")

def createsupplier(supplier:SupplierCreate,db:Session):
    try:
        existing_supplier=db.query(Supplier).filter(supplier.company==Supplier.company).first()
        if existing_supplier:
            raise HTTPException(status_code=400,detail="already supplier exists")
        create_supp=Supplier(
        company=supplier.company,
        contact=supplier.contact,
        email=supplier.email,
        phone=supplier.phone   
    )
        db.add(create_supp)
        db.commit()
        db.refresh(create_supp)
        logger.info("Supplier Created")
        return create_supp
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to Create Supplier:{str(e)}")
        raise HTTPException(status_code=400,detail="Failed to Create Supplier")

def getsupplierbyid(supplier_id:int,db:Session):
    try:
        sup_id=db.query(Supplier).filter(Supplier.id==supplier_id).first()
        if sup_id is None:
            raise HTTPException(status_code=404,detail="supplier not found")
        return sup_id
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to Get Supplier:{str(e)}")
        raise HTTPException(status_code=404,detail="Supplier not found")


def update_supplier(supplier_id:int,update:SupplierUpdate,db:Session):
    try:
        sup_id=(db.query(Supplier).filter(Supplier.id==supplier_id).first())
        if sup_id is None:
           raise HTTPException(status_code=404,detail="supplier not found")
        update_supplier=update.model_dump(exclude_unset=True)

        for key,value in update_supplier.items():
          setattr(sup_id,key,value)
        db.commit()
        db.refresh(sup_id)
        return sup_id
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to Update Supplier:{str(e)}")
        raise HTTPException(status_code=500,detail="Failed to Update Supplier")


def del_supplier(supplier_id:int,db:Session):
    try:
        sup_id=db.query(Supplier).filter(Supplier.id==supplier_id).first()
        if sup_id is None:
            raise HTTPException(status_code=404,detail="supplier not found")
        db.delete(sup_id)
        db.commit()
        logger.info("Supplier Deleted")
        return {"supplier deleted"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to Delete Supplier:{str(e)}")
        raise HTTPException(status_code=500,detail="Failed to Delete Supplier")

