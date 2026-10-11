import pytest
import os
os.environ["DATABASE_URL"] = "sqlite:///./test.db"
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.category import Category
from app.models.supplier import Supplier
from app.models.user import User
from app.models.product import Product
from app.models.purchaseorders import PurchaseOrder
from app.models.salesorders import Salesorders
from app.models.stocktransactions import Stocktransactions
from dotenv import load_dotenv

load_dotenv(".env.test")
from app.main import app
from app.database.database import Base
from app.dependencies import get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

@pytest.fixture(autouse=True)
def clean_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def category(db_session):
    category = Category(
        name="Electronics"
    )
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)
    return category
import uuid

@pytest.fixture
def supplier(db_session):
    supplier = Supplier(
        company="ABC Technologies",
        contact="Ganesh",
        email=f"{uuid.uuid4()}@test.com",
        phone="9876543210"
    )

    db_session.add(supplier)
    db_session.commit()
    db_session.refresh(supplier)

    yield supplier

    db_session.delete(supplier)
    db_session.commit()
@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as client:
        yield client

    app.dependency_overrides.clear()           