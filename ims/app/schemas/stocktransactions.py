from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.stocktrantype import StockType

class StockCreate(BaseModel):
    product_id:int
    type:StockType
    qty:int
    remarks:str

class StockUpdate(BaseModel):
    type:Optional[StockType]=None
    qty:Optional[int]=None
    remarks:Optional[str]=None


class StockResponse(BaseModel):
    id:int
    product_id:int
    type:StockType
    qty:int
    remarks:str
    created_at:datetime
    updated_at:datetime

    model_config={
        "from_attributes":True
    }

