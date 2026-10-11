from fastapi.testclient import TestClient
import uuid



def test_category(client):
    name=f"{uuid.uuid4()}"
    cat={"name":name}

    response=client.post(
        "/categories/createcategory",json=cat
    )

    assert response.status_code==201

    data=response.json()

    assert data["name"]==name

def test_duplicate_category(client):

    cat={"name":"Electronics"}

    client.post("/categories/createcategory", json=cat)

    response=client.post("/categories/createcategory",json=cat)

    assert response.status_code==400
def test_get_category(client):

    response=client.get("/categories")
    assert response.status_code==200  

def test_update_category(client):
        # Create category
    create_response = client.post(
        "/categories/createcategory",
        json={"name": "Electronics"}
    )

    assert create_response.status_code == 201

    category_id = create_response.json()["id"]
    response=client.put("/categories/1",json={"name":"update electronics"})
    assert response.status_code==200 
    data=response.json()
    assert data["id"]==category_id
    assert data["name"]=="update electronics"

def test_delete_category(client):
        # Create category
    create_response = client.post(
        "/categories/createcategory",
        json={"name": "Electronics"}
    )

    assert create_response.status_code == 201

    
    respose=client.delete("/categories/1")
    assert respose.status_code==200

def test_get_category_byid(client):
        # Create category
    create_response = client.post(
        "/categories/createcategory",
        json={"name": "Electronics"}
    )

    assert create_response.status_code == 201
    cat_id=create_response.json()["id"]
    
    respose=client.get(f"/categories/{cat_id}")
    assert respose.status_code==200