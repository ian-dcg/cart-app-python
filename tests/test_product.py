import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_product():
    response = client.post("/products/", json={"name": "Café", "price": 12.5, "quantity": 2})
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Café"
    assert data["price"] == 12.5
    assert data["quantity"] == 2

def test_get_all_products():
    response = client.get("/products/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
