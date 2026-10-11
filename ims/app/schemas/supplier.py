from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SupplierCreate(BaseModel):
    company:str
    contact:str
    email:str
    phone:str

class SupplierUpdate(BaseModel):
    company:Optional[str]=None
    contact:Optional[str]=None
    email:Optional[str]=None
    phone:Optional[str]=None

class SupplierResponse(BaseModel):
    id:int
    company:str
    contact:str
    email:str
    phone:str
    created_at:datetime
    updated_at:datetime

    model_config={
        "from_attributes":True
    }