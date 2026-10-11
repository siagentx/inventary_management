from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session
from app.models.category import Category
from typing import List
from fastapi import HTTPException
from app.dependencies import get_db,get_current_admin
from app.schemas.category import CategoryCreate,CategoryResponse,CategoryUpdate

router=APIRouter(
    prefix="/categories",
    tags=["Categories"]
)

@router.get("/",response_model=List[CategoryResponse])
def getallcategories(db:Session=Depends(get_db)):
    categories=db.query(Category).all()
    return categories

@router.post("/createcategory",response_model=CategoryResponse,status_code=201)
def createcategory(category:CategoryCreate,db:Session=Depends(get_db)):
    existing_category=db.query(Category).filter(category.name==Category.name).first()
    if existing_category:
        raise HTTPException(status_code=400,detail="Category Already Exists")
    create_cat=Category(
        name=category.name
    )
    db.add(create_cat)
    db.commit()
    db.refresh(create_cat)
    return create_cat
@router.get("/{category_id}",response_model=CategoryResponse)
def getcategorybyid(category_id:int,db:Session=Depends(get_db)):
    category_id=db.query(Category).filter(Category.id==category_id).first()
    if category_id is None:
        raise HTTPException(status_code=404,detail="Category not found")
    return category_id
@router.put("/{category_id}",response_model=CategoryResponse)
def updatecategory(category_id:int,category:CategoryUpdate,db:Session=Depends(get_db)):
    categoryid=db.query(Category).filter(Category.id==category_id).first()
    if categoryid is None:
        raise HTTPException(status_code=404,detail="Category not found")
    update_category=category.model_dump(exclude_unset=True)

    for key,value in update_category.items():
        setattr(categoryid,key,value)
    db.commit()
    db.refresh(categoryid)
    return categoryid

@router.delete("/{category_id}")
def delete_cat(category_id:int,db:Session=Depends(get_db)):
    categoryid=db.query(Category).filter(Category.id==category_id).first()
    if categoryid is None:
        raise HTTPException(status_code=404,detail="Category not found")
    db.delete(categoryid)
    db.commit()
    return {"Category Deleted"}
