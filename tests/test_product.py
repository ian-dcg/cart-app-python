from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_and_list_products():
    response = client.post("/products/", json={
        "name": "Arroz",
        "price": 20.0,
        "quantity": 5
    })
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Arroz"
    assert data["price"] == 20.0
    assert data["quantity"] == 5

    response = client.get("/products/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
