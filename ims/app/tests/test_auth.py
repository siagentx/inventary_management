from fastapi.testclient import TestClient
import uuid
def test_register(client):
    email=f"{uuid.uuid4()}@test.com"
    user = {
        "username": "Ganesh",
        "email": email,
        "password": "Password@123",
        "role": "Admin"
    }

    response = client.post(
        "/auth/register",
        json=user
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == email
    assert data["username"] == "Ganesh"

def test_register_duplicate_email(client):

    user = {
        "username": "Ganesh",
        "email": "ganesh@test.com",
        "password": "Password@123",
        "role": "Admin"
    }

    client.post("/auth/register", json=user)

    response = client.post("/auth/register", json=user)

    assert response.status_code == 400
def test_login_success(client):
    user = {
    "username": "Ganesh",
    "email": "ganesh@test.com",
    "password": "Password@123",
    "role": "Admin"}
    client.post("/auth/register", json=user)
    response = client.post(
    "/auth/login",
    data={
        "username": "ganesh@test.com",
        "password": "Password@123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
def test_login_wrong_password(client):
    response = client.post(
    "/auth/login",
    data={
        "username": "ganesh@test.com",
        "password": "WrongPassword"
    })
    assert response.status_code == 401
def test_login_invalid_email(client):
    response = client.post(
    "/auth/login",
    data={
        "username": "wrong@test.com",
        "password": "Password@123"
    })
    print(response.status_code)
    print(response.json())
    assert response.status_code == 401



