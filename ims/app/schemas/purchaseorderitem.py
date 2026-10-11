from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PurchaseOrderCreate(BaseModel):
    purchase_order_id:int
    product_id:int
    qty:int
    unit_price:float

class PurchaseOrderUpdate(BaseModel):
     qty:Optional[int]=None
     unit_price:Optional[float]=None

class PurchaseOrderResponse(BaseModel):
     id:int
     purchase_order_id:int
     product_id:int
     qty:int
     unit_price:int
     created_at:datetime
     updated_at:datetime

     model_config={
        "from_attributes":True
    }