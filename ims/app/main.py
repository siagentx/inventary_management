from fastapi import FastAPI

from app.database.database import engine
from app.database.database import Base
from app.core.redis import redis_client
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.supplier import Supplier
from app.models.purchaseorders import PurchaseOrder
from app.models.purchaseorderitems import Purchaseorderitems
from app.models.salesorders import Salesorders
from app.models.salesorderitems import Salesorderitems
from app.models.stocktransactions import Stocktransactions
from app.routers.user import router as user_router
from app.routers.auth import router as auth_router
from app.routers.category import router as category_router
from app.routers.supplier import router as supplier_router
from app.routers.product import router as product_router
from app.routers.stocktransactions import router as stock_router
from app.routers.purchaseorders import router as po_router
from app.routers.purchaseorderitem import router as po_item
from app.routers.salesorder import router as so
from app.routers.salesorderitem import router as so_item
from app.routers.dashboard import router as dashboard
from app.exceptions import register_exception_handlers
from app.logging_config import logger
from fastapi.middleware.cors import CORSMiddleware
from app.routers import mail

import app.models
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
register_exception_handlers(app)
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(category_router)
app.include_router(supplier_router)
app.include_router(product_router)
app.include_router(stock_router)
app.include_router(po_router)
app.include_router(po_item)
app.include_router(so)
app.include_router(so_item)
app.include_router(dashboard)
app.include_router(mail.router)

@app.get("/")
def home():
    return {
        "message": "Inventary Management"
    }
@app.get("/redis-test")
def redis_test():
    redis_client.set("message", "Redis Connected")
    return {"message": redis_client.get("message")}