from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_listar_todos_os_carrinhos():
    # Cria pelo menos dois carrinhos
    ids = []
    for _ in range(2):
        resp = client.post("/cart/")
        assert resp.status_code == 200
        ids.append(resp.json())

    # Lista todos os carrinhos
    resp = client.get("/cart/")
    assert resp.status_code == 200
    carrinhos = resp.json()
    assert isinstance(carrinhos, list)
    # Verifica se os carrinhos recém-criados estão presentes
    ids_retornados = [c["id"] for c in carrinhos]
    for cid in ids:
        assert cid in ids_retornados
