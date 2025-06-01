from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_deletar_carrinho_existente():
    # Criar carrinho
    resp = client.post("/cart/")
    carrinho_id = resp.json()

    # Deletar carrinho
    resp_delete = client.delete(f"/cart/{carrinho_id}")
    assert resp_delete.status_code == 204

    # Verificar que carrinho não existe mais
    resp_check = client.get(f"/cart/{carrinho_id}")
    assert resp_check.status_code == 404

def test_deletar_carrinho_inexistente():
    # Tenta deletar carrinho com ID muito alto
    resp = client.delete("/cart/999999")
    assert resp.status_code == 404
