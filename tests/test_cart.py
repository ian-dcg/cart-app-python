
from fastapi.testclient import TestClient
from app.main import app
import pytest

client = TestClient(app)

# --- test_cart.py ---
def test_criar_e_obter_carrinho():
    resp_criacao = client.post("/cart/")
    assert resp_criacao.status_code == 200
    carrinho_id = resp_criacao.json()
    assert isinstance(carrinho_id, int)

    resp_obter = client.get(f"/cart/{carrinho_id}")
    assert resp_obter.status_code == 200
    data = resp_obter.json()
    assert data["id"] == carrinho_id
    assert data["items"] == []

def test_adicionar_item_ao_carrinho():
    resp_prod = client.post("/products/", json={"name": "Sabonete", "price": 3.5, "quantity": 10, "setor": "Hortifruti"})
    assert resp_prod.status_code == 201
    produto_id = resp_prod.json()["id"]

    resp_cart = client.post("/cart/")
    carrinho_id = resp_cart.json()

    resp_item = client.post(f"/cart/{carrinho_id}/items", json={"produto_id": produto_id, "quantidade": 2})
    assert resp_item.status_code == 200
    item_data = resp_item.json()
    assert item_data["produto_id"] == produto_id
    assert item_data["quantidade"] == 2

    resp_check = client.get(f"/cart/{carrinho_id}")
    assert resp_check.status_code == 200
    carrinho_data = resp_check.json()
    assert any(item["produto_id"] == produto_id for item in carrinho_data["items"])

# --- test_cart_delete.py ---
def test_deletar_carrinho_existente():
    resp = client.post("/cart/")
    carrinho_id = resp.json()

    resp_delete = client.delete(f"/cart/{carrinho_id}")
    assert resp_delete.status_code == 204

    resp_check = client.get(f"/cart/{carrinho_id}")
    assert resp_check.status_code == 404

def test_deletar_carrinho_inexistente():
    resp = client.delete("/cart/999999")
    assert resp.status_code == 404

# --- test_cart_list.py ---
def test_listar_todos_os_carrinhos():
    ids = []
    for _ in range(2):
        resp = client.post("/cart/")
        assert resp.status_code == 200
        ids.append(resp.json())

    resp = client.get("/cart/")
    assert resp.status_code == 200
    carrinhos = resp.json()
    ids_retornados = [c["id"] for c in carrinhos]
    for cid in ids:
        assert cid in ids_retornados

# --- test_cart_erros.py ---
def test_adicionar_produto_inexistente():
    resp_cart = client.post("/cart/")
    carrinho_id = resp_cart.json()
    resp = client.post(f"/cart/{carrinho_id}/items", json={"produto_id": 9999, "quantidade": 1})
    assert resp.status_code == 400 or resp.status_code == 404

def test_adicionar_quantidade_invalida():
    resp_prod = client.post("/products/", json={"name": "ItemX", "price": 5.0, "quantity": 10, "setor": "Limpeza"})
    produto_id = resp_prod.json()["id"]

    resp_cart = client.post("/cart/")
    carrinho_id = resp_cart.json()

    resp = client.post(f"/cart/{carrinho_id}/items", json={"produto_id": produto_id, "quantidade": -2})
    assert resp.status_code == 400 or resp.status_code == 422

# --- test_cart_parametrizado.py ---
@pytest.mark.parametrize("nome,preco,quantidade", [
    ("Arroz", 10.0, 1),
    ("Feijão", 7.5, 3),
    ("Leite", 4.2, 5)
])
def test_produtos_em_varios_carrinhos(nome, preco, quantidade):
    resp_prod = client.post("/products/", json={"name": nome, "price": preco, "quantity": 50, "setor": "Padaria"})
    assert resp_prod.status_code == 201
    produto_id = resp_prod.json()["id"]

    resp_cart = client.post("/cart/")
    assert resp_cart.status_code == 200
    cart_id = resp_cart.json()

    resp_item = client.post(f"/cart/{cart_id}/items", json={"produto_id": produto_id, "quantidade": quantidade})
    assert resp_item.status_code == 200

    resp_get = client.get(f"/cart/{cart_id}")
    assert resp_get.status_code == 200
    carrinho = resp_get.json()
    assert any(item["produto_id"] == produto_id for item in carrinho["items"])
