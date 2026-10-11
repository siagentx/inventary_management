from pydantic import BaseModel
from typing import Optional,List
from datetime import datetime
from app.models.purchasestatus import Purchasestatus

class PurchaseCreate(BaseModel):
    supplier_id: int
    items: List[PurchaseItemCreate]
    
class PurchaseItemCreate(BaseModel):
    product_id: int
    qty: int

class PurchaseUpdate(BaseModel):
    status:Optional[Purchasestatus]=None
    total_amount:Optional[float]=None

class SupplierResponse(BaseModel):
    id:int
    name:str

    model_config={
        "from_attributes":True
    }   

class PurchaseResponse(BaseModel):
    id:int
    supplier_id:int
    status:Purchasestatus
    total_amount:float
    created_at:datetime
    updated_at:datetime

    model_config={"from_attributes":True}


