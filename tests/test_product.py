from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_criar_produto_com_setor_e_filtrar_por_setor():
    client.post(
        "/products/",
        json={"name": "Leite", "price": 4.50, "quantity": 20, "setor": "Bebidas"},
    )
    client.post(
        "/products/",
        json={"name": "Baguete", "price": 3.00, "quantity": 15, "setor": "Padaria"},
    )

    # Filtro por setor
    resp = client.get("/products?setor=Bebidas")
    assert resp.status_code == 200
    data = resp.json()
    assert all(prod["setor"] == "Bebidas" for prod in data)


def test_filtrar_por_nome_e_combinado_com_setor():
    client.post(
        "/products/",
        json={"name": "Sabão em Pó", "price": 8.99, "quantity": 5, "setor": "Limpeza"},
    )
    client.post(
        "/products/",
        json={
            "name": "Sabonete Líquido",
            "price": 6.50,
            "quantity": 8,
            "setor": "Limpeza",
        },
    )

    # Filtro parcial por nome
    resp_nome = client.get("/products?nome=sab")
    assert resp_nome.status_code == 200
    nomes = [p["name"].lower() for p in resp_nome.json()]
    assert any("sab" in nome for nome in nomes)

    # Filtro combinado
    resp_comb = client.get("/products?setor=Limpeza&nome=sab")
    assert resp_comb.status_code == 200
    for prod in resp_comb.json():
        assert "sab" in prod["name"].lower()
        assert prod["setor"] == "Limpeza"
