from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_criar_e_obter_carrinho():
    # Criar carrinho
    resp_criacao = client.post("/cart/")
    assert resp_criacao.status_code == 200
    carrinho_id = resp_criacao.json()
    assert isinstance(carrinho_id, int)

    # Obter carrinho vazio
    resp_obter = client.get(f"/cart/{carrinho_id}")
    assert resp_obter.status_code == 200
    data = resp_obter.json()
    assert data["id"] == carrinho_id
    assert data["items"] == []

def test_adicionar_item_ao_carrinho():
    # Criar produto primeiro
    resp_prod = client.post("/products/", json={"name": "Sabonete", "price": 3.5, "quantity": 10})
    assert resp_prod.status_code == 201
    produto_id = resp_prod.json()["id"]

    # Criar carrinho
    resp_cart = client.post("/cart/")
    carrinho_id = resp_cart.json()

    # Adicionar item
    resp_item = client.post(f"/cart/{carrinho_id}/items", json={"produto_id": produto_id, "quantidade": 2})
    assert resp_item.status_code == 200
    item_data = resp_item.json()
    assert item_data["produto_id"] == produto_id
    assert item_data["quantidade"] == 2

    # Confirmar no carrinho
    resp_check = client.get(f"/cart/{carrinho_id}")
    assert resp_check.status_code == 200
    carrinho_data = resp_check.json()
    assert any(item["produto_id"] == produto_id for item in carrinho_data["items"])
