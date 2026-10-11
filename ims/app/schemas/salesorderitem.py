from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CreateSOItem(BaseModel):
    sales_order_id:int
    product_id:int
    qty:int
    unit_price:float

class UpdateSOItem(BaseModel):
    qty:Optional[int]=None
    unit_price:Optional[float]=None

class ResponseSOItem(BaseModel):
    id:int
    sales_order_id:int
    product_id:int
    qty:int
    unit_price:float
    created_at:datetime
    updated_at:datetime

    model_config={
        "from_attributes":True
    }