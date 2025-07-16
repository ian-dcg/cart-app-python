import asyncpg

from app.domains.cart.model import CartItemCreate, CartItemOut, CartOut
from app.settings import DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER


async def get_connection():
    return await asyncpg.connect(
        user=DB_USER, password=DB_PASSWORD, database=DB_NAME, host=DB_HOST, port=DB_PORT
    )


async def create_cart() -> int:
    conn = await get_connection()
    row = await conn.fetchrow("INSERT INTO carrinhos DEFAULT VALUES RETURNING id")
    await conn.close()
    return row["id"]


async def add_item_to_cart(carrinho_id: int, item: CartItemCreate) -> CartItemOut:
    conn = await get_connection()
    row = await conn.fetchrow(
        "INSERT INTO itens_carrinho (carrinho_id, produto_id, quantidade) VALUES ($1, $2, $3) RETURNING id, produto_id, quantidade",
        carrinho_id,
        item.produto_id,
        item.quantidade,
    )
    await conn.close()
    return CartItemOut(**row)


async def remove_item_from_cart(carrinho_id: int, item_id: int) -> bool:
    conn = await get_connection()
    result = await conn.execute(
        "DELETE FROM itens_carrinho WHERE id = $1 AND carrinho_id = $2",
        item_id,
        carrinho_id,
    )
    await conn.close()
    return result.startswith("DELETE 1")


async def get_cart(carrinho_id: int) -> CartOut:
    conn = await get_connection()
    cart = await conn.fetchrow("SELECT id FROM carrinhos WHERE id = $1", carrinho_id)
    if not cart:
        await conn.close()
        raise KeyError("Carrinho não encontrado")

    rows = await conn.fetch(
        "SELECT id, produto_id, quantidade FROM itens_carrinho WHERE carrinho_id = $1",
        carrinho_id,
    )
    await conn.close()
    items = [CartItemOut(**r) for r in rows]
    return CartOut(id=carrinho_id, items=items)


async def list_all_carts() -> list[CartOut]:
    conn = await get_connection()
    cart_rows = await conn.fetch("SELECT id FROM carrinhos")
    all_carts = []
    for row in cart_rows:
        cart_id = row["id"]
        item_rows = await conn.fetch(
            "SELECT id, produto_id, quantidade FROM itens_carrinho WHERE carrinho_id = $1",
            cart_id,
        )
        items = [CartItemOut(**item) for item in item_rows]
        all_carts.append(CartOut(id=cart_id, items=items))
    await conn.close()
    return all_carts


async def delete_cart(cart_id: int) -> bool:
    conn = await get_connection()
    result = await conn.execute("DELETE FROM carrinhos WHERE id = $1", cart_id)
    await conn.close()
    return result.startswith("DELETE 1")


async def calcular_total_carrinho(cart_id: int) -> dict:
    conn = await get_connection()
    query = """
        SELECT SUM(p.price * i.quantidade) AS total
        FROM itens_carrinho i
        JOIN produtos p ON p.id = i.produto_id
        WHERE i.carrinho_id = $1
    """
    row = await conn.fetchrow(query, cart_id)
    await conn.close()
    total = float(row["total"]) if row["total"] is not None else 0.0
    return {"carrinho_id": cart_id, "total": round(total, 2)}
