import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.mark.parametrize("nome,preco,quantidade", [
    ("Arroz", 10.0, 1),
    ("Feijão", 7.5, 3),
    ("Leite", 4.2, 5)
])
def test_produtos_em_varios_carrinhos(nome, preco, quantidade):
    # Cria produto
    resp_prod = client.post("/products/", json={"name": nome, "price": preco, "quantity": 50})
    assert resp_prod.status_code == 201
    produto_id = resp_prod.json()["id"]

    # Cria carrinho
    resp_cart = client.post("/cart/")
    assert resp_cart.status_code == 200
    cart_id = resp_cart.json()

    # Adiciona item ao carrinho
    resp_item = client.post(f"/cart/{cart_id}/items", json={"produto_id": produto_id, "quantidade": quantidade})
    assert resp_item.status_code == 200

    # Valida se item está presente no carrinho
    resp_get = client.get(f"/cart/{cart_id}")
    assert resp_get.status_code == 200
    carrinho = resp_get.json()
    assert any(item["produto_id"] == produto_id for item in carrinho["items"])
