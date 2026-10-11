from fastapi.testclient import TestClient
import uuid


def test_create_supplier(client):
    company=f"{uuid.uuid4()}"
    supplier={
        "company":company,
        "contact":"ganesh",
        "email":"gk1313@gmail.com",
        "phone":"9600697134"
    }

    response=client.post("/suppliers/create_supplier",json=supplier)

    assert response.status_code==201

    data=response.json()

    assert data["company"]==company
    assert data["contact"]=="ganesh"
    assert data["email"]=="gk1313@gmail.com"
    assert data["phone"]=="9600697134"

def test_duplicate_supplier(client):
    supplier={
        "company":"abc",
        "contact":"ganesh",
        "email":"gk1313@gmail.com",
        "phone":"9600697134"
    }
    client.post("/suppliers/create_supplier",json=supplier)

    response=client.post("/suppliers/create_supplier",json=supplier)

    assert response.status_code==400

def test_get_supplier(client):
    response=client.get("/suppliers")
    assert response.status_code==200
def test_update_supplier(client):
    supplier={
            "company":"abc",
            "contact":"ganesh",
            "email":"gk1313@gmail.com",
            "phone":"9600697134"
        }
    res=client.post("/suppliers/create_supplier",json=supplier)
    assert res.status_code==201
    
    supplier_id = res.json()["id"]
    up_supplier={
                "company":"update abc",
                "contact":"update ganesh",
                "email":"gk1313@gmail.com",
                "phone":"9600607134"
            }
    response=client.put("/suppliers/1",json=up_supplier)
    assert response.status_code==200
    data=response.json()
    assert data["id"]==supplier_id
    assert data["company"]=="update abc"
    assert data["contact"]=="update ganesh"
    assert data["email"]=="gk1313@gmail.com"
    assert data["phone"]=="9600607134"
def test_delete_supplier(client):
    supplier={
                "company":"abc",
                "contact":"ganesh",
                "email":"gk1313@gmail.com",
                "phone":"9600697134"
            }
    res=client.post("/suppliers/create_supplier",json=supplier)
    assert res.status_code==201

    res=client.delete("/suppliers/1")
    assert res.status_code==200
def test_get_supplierbyid(client):
    supplier={
                "company":"abc",
                "contact":"ganesh",
                "email":"gk1313@gmail.com",
                "phone":"9600697134"
            }
    res=client.post("/suppliers/create_supplier",json=supplier)
    assert res.status_code==201
    sup_id=res.json()["id"]
    res=client.get(f"/suppliers/{sup_id}")
    assert res.status_code==200
