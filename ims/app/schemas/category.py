from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CategoryCreate(BaseModel):
    name:str

class CategoryUpdate(BaseModel):
    name:Optional[str]=None

class CategoryResponse(BaseModel):
    id:int
    name:str
    created_at:datetime
    updated_at:datetime
    model_config={
        'from_attributes':True
    }
