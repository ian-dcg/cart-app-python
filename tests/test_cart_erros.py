from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_adicionar_produto_inexistente():
    # Cria carrinho
    resp_cart = client.post("/cart/")
    carrinho_id = resp_cart.json()

    # Tenta adicionar produto inexistente
    resp = client.post(f"/cart/{carrinho_id}/items", json={"produto_id": 9999, "quantidade": 1})
    assert resp.status_code == 400 or resp.status_code == 404

def test_adicionar_quantidade_invalida():
    # Cria produto válido
    resp_prod = client.post("/products/", json={"name": "ItemX", "price": 5.0, "quantity": 10})
    produto_id = resp_prod.json()["id"]

    # Cria carrinho
    resp_cart = client.post("/cart/")
    carrinho_id = resp_cart.json()

    # Tenta adicionar com quantidade inválida
    resp = client.post(f"/cart/{carrinho_id}/items", json={"produto_id": produto_id, "quantidade": -2})
    assert resp.status_code == 400 or resp.status_code == 422
