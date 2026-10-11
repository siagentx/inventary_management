from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import patch
client = TestClient(app)


@patch("app.services.product_service.product_created.delay")
def test_create_product(mock_delay, client, category, supplier):

    product = {
        "sku": "P100",
        "name": "Mouse",
        "category_id": category.id,
        "supplier_id": supplier.id,
        "price": 500,
        "qty": 20
    }

    response = client.post(
        "/products/create_product",
        json=product
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Mouse"
    assert data["sku"] == "P100"
    assert data["qty"] == 20

    mock_delay.assert_called_once_with("Mouse")

def test_get_products(client):
    response=client.get("/products")
    assert response.status_code==200

def test_update_products(client,category,supplier):
    product = {
            "sku": "P100",
            "name": "Mouse",
            "category_id": category.id,
            "supplier_id": supplier.id,
            "price": 500,
            "qty": 20
        }
    with patch("app.services.product_service.delete_cache"), \
         patch("app.services.product_service.product_created.delay"):

        response = client.post(
            "/products/create_product",
            json=product
        )
    
   
    
    assert response.status_code == 201
    product_id=response.json()["id"]
    up_product = {
                "sku": "P1001",
                "name": "Mouse1",
                "category_id": category.id,
                "supplier_id": supplier.id,
                "price": 5001,
                "qty": 21
            }
    res=client.put(f"/products/{product_id}",json=up_product)
    assert res.status_code==200
    data=res.json()
    assert data["id"]==product_id
    assert data["sku"]=="P1001"
    assert data["name"]=="Mouse1"
    assert data["price"]==5001
    assert data["qty"]==21
def test_delete_products(client,category,supplier):
    product = {
                "sku": "P100",
                "name": "Mouse",
                "category_id": category.id,
                "supplier_id": supplier.id,
                "price": 500,
                "qty": 20
            }
    with patch("app.services.product_service.delete_cache"), \
            patch("app.services.product_service.product_created.delay"):
    
         response = client.post(
                "/products/create_product",
                json=product
            )
        
       
        
    assert response.status_code == 201
    product_id=response.json()["id"]

    res=client.delete(f"/products/{product_id}")
    assert res.status_code==200
def test_get_products_by_id(client,category,supplier):
    product = {
                    "sku": "P100",
                    "name": "Mouse",
                    "category_id": category.id,
                    "supplier_id": supplier.id,
                    "price": 500,
                    "qty": 20
                }
    with patch("app.services.product_service.delete_cache"), \
                patch("app.services.product_service.product_created.delay"):
        
             response = client.post(
                    "/products/create_product",
                    json=product
                )
            
           
            
    assert response.status_code == 201
    product_id=response.json()["id"]
    
    res=client.get(f"/products/{product_id}")
    assert res.status_code==200