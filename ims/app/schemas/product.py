from pydantic import BaseModel
from typing import Optional
from datetime import datetime
class ProductBase(BaseModel):
    sku:str
    name:str
    category_id:int
    supplier_id:int
    price:float
    qty:int

class ProductCreate(ProductBase):
    pass 

class ProductUpdate(BaseModel):
    sku:Optional[str]=None
    name:Optional[str]=None
    category_id:Optional[int]=None
    supplier_id:Optional[int]=None 
    price:Optional[float]=None
    qty:Optional[int]=None
class CategoryResponse(BaseModel):
    id:int
    name:str

    model_config={
        "from_attributes":True
    }
class SupplierResponse(BaseModel):
    id:int
    company:str

    model_config={
        "from_attributes":True
    }    
class ProductResponse(BaseModel):
    id:int
    sku:str
    name:str
    price:float
    qty:int

    category:CategoryResponse
    supplier:SupplierResponse

    created_at:datetime
    updated_at:datetime

    model_config={
        "from_attributes":True
    }

