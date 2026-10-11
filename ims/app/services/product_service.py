from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate,ProductUpdate,ProductResponse
from app.models.category import Category
from app.models.supplier import Supplier
from app.logging_config import logger
from typing import Optional
from app.core.cache import get_cache, set_cache
from app.core.cache import delete_cache
from app.tasks import product_created
def get_products(db:Session,
                 category_id:Optional[int]=None,
                 supplier_id:Optional[int]=None,
                 skip:int=0,limit:int=10,
                 search:Optional[str]=None,
                 max_price:Optional[float]=None,
                 min_price:Optional[float]=None,
                 sort:Optional[str]=None,
                 order:str="asc"):
    try:
        cache_key = (
    f"products:"
    f"{category_id}:"
    f"{supplier_id}:"
    f"{skip}:"
    f"{limit}:"
    f"{search}:"
    f"{min_price}:"
    f"{max_price}:"
    f"{sort}:"
    f"{order}"
)
        cache = get_cache(cache_key)

        if cache:
            print("✅ Data returned from Redis")
            return cache

        print("📦 Data returned from PostgreSQL")

        products = db.query(Product)
        products=db.query(Product)
        if category_id:
            products=products.filter(Product.category_id==category_id)
        if supplier_id:
            products=products.filter(Product.supplier_id==supplier_id)        
        if min_price is not None:
            products = products.filter(Product.price >= min_price)    
        if max_price is not None:
            products=products.filter(Product.price<=max_price)   
        allowed_sort_fields = [
            "name",
            "price",
            "qty",
            "created_at"
            ]
        allowed_orders=["desc","asc"]
        if search:
            products=products.filter(Product.name.ilike(f"%{search}%"))
        if sort:
            if sort not in allowed_sort_fields:
                raise HTTPException(status_code=400,detail="Invalid sort field") 
            if order not in allowed_orders:
                raise HTTPException(status_code=400,detail="Invalid order field")    
            column = getattr(Product, sort)
            if order == "desc":
                products = products.order_by(column.desc())
            else:
                products = products.order_by(column.asc()) 
        products = products.offset(skip).limit(limit).all()

        result = [ProductResponse.model_validate(product).model_dump(mode="json")
                  for product in products]

        set_cache(cache_key, result)

        print("💾 Data stored in Redis")

        return result
    
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise


def create_product(db:Session,product:ProductCreate):
    
    try:
        category=db.query(Category).filter(Category.id==product.category_id).first()
        if not category:
           raise HTTPException(status_code=404,detail="Category not found") 
        supplier=db.query(Supplier).filter(Supplier.id==product.supplier_id).first()
        if not supplier:
           raise HTTPException(status_code=404,detail="supplier not found")
        db_product=Product(
            sku=product.sku,
            name=product.name,
            category_id=product.category_id,
            supplier_id=product.supplier_id,
            price=product.price,
            qty=product.qty)

        db.add(db_product)
        db.commit()
        delete_cache("products")
        db.refresh(db_product)
        print("before delay")
        product_created.delay(db_product.name)
        print("after delay")
        logger.info(f"Product '{product.name}' created successfully")
        return db_product
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"failed to create product:{str(e)}")
        raise HTTPException(status_code=500,detail="Failed to create product")

def getproductbyid(product_id:int,db:Session):
    try:
        product=(db.query(Product).filter(Product.id==product_id).first())
        if not product:
            raise HTTPException(status_code=404,detail="product not found")
        return product
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"failed to get that product:{str(e)}")
        raise HTTPException(status_code=404,detail="Failed to get product")

def get_product_update(product_id:int,update:ProductUpdate,db:Session):
    try:
        product=(db.query(Product).filter(Product.id==product_id).first())
        if not product:
            raise HTTPException(status_code=404,detail="product not found")
        update_product=update.model_dump(exclude_unset=True)
        for key,value in update_product.items():
            setattr(product,key,value)
        db.commit()
        logger.info(f"Product ID {product.id} updated successfully")
        db.refresh(product)
        return product
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"failed to update the product:{str(e)}")
        raise HTTPException(status_code=400,detail="failed to update the product")

def delete_product(product_id:int,db:Session):
    try:
        product=db.query(Product).filter(Product.id==product_id).first()
        if not product:
            raise HTTPException(status_code=404,detail="product not found")
        db.delete(product)
        db.commit()
        delete_cache("products")
        logger.info(f"Product ID {product.id} deleted successfully")
        return {"Product Deleted"}
    except HTTPException:
            raise
    except Exception as e:
        db.rollback()
        logger.error(f"failed to delete that product:{str(e)}")
        raise HTTPException(status_code=404,detail="Failed to delete product")


