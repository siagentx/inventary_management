from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.salesstatus import Salesstatus

class Sales_order_create(BaseModel):
    cust_name:str
    status:Salesstatus
    total_amount:float

class SalesUpdate(BaseModel):
    cust_name:Optional[str]=None
    status:Optional[Salesstatus]=None
    total_amount:Optional[float]=None

class SalesResponse(BaseModel):
    id:int
    cust_name:str
    status:Salesstatus
    total_amount:float
    created_at:datetime
    updated_at:datetime

    model_config={
        "from_attributes":True
    }

