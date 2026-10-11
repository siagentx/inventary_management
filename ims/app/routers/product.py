from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from typing import List,Optional
from app.dependencies import get_db
from app.schemas.product import ProductCreate,ProductResponse,ProductUpdate
from app.services import product_service
router=APIRouter(
    prefix="/products",
    tags=["products"]
)
@router.get("/",response_model=List[ProductResponse])
def get_products(db:Session=Depends(get_db),
                 category_id:Optional[int]=None,
                 supplier_id:Optional[int]=None,
                 skip:int=0,limit:int=10,
                 search:Optional[str]=None,
                 max_price:Optional[float]=None,
                 min_price:Optional[float]=None,
                 sort:Optional[str]=None,
                 order:str="asc"):
    return product_service.get_products(db,category_id,supplier_id,skip,limit,search,max_price,min_price,sort,order)
@router.post("/create_product",response_model=ProductResponse,status_code=201)
def create_product(product:ProductCreate,db:Session=Depends(get_db)):
     return product_service.create_product(db,product)

@router.get("/{product_id}",response_model=ProductResponse)
def getproductbyid(product_id:int,db:Session=Depends(get_db)):
    return product_service.getproductbyid(product_id,db)

@router.put("/{product_id}",response_model=ProductResponse)
def product_update(product_id:int,update:ProductUpdate,db:Session=Depends(get_db)):
    return product_service.get_product_update(product_id,update,db)
    
@router.delete("/{product_id}")
def delete_product(product_id:int,db:Session=Depends(get_db)):
    return product_service.delete_product(product_id,db)