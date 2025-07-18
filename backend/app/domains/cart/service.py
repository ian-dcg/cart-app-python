import asyncpg

from app.domains.cart.model import (CartItemCreate, CartItemOut,
                                    CartItemUpdate, CartOut)
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
    existing_item = await conn.fetchrow(
        "SELECT id, quantidade FROM itens_carrinho WHERE carrinho_id = $1 AND produto_id = $2",
        carrinho_id,
        item.produto_id,
    )
    if existing_item:
        new_quantity = existing_item["quantidade"] + item.quantidade
        row = await conn.fetchrow(
            "UPDATE itens_carrinho SET quantidade = $1 WHERE id = $2 RETURNING id, produto_id, quantidade",
            new_quantity,
            existing_item["id"],
        )
    else:
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


async def update_cart_item_quantity(
    carrinho_id: int, item_id: int, item_update: CartItemUpdate
) -> CartItemOut:
    conn = await get_connection()
    row = await conn.fetchrow(
        "UPDATE itens_carrinho SET quantidade = $1 WHERE id = $2 AND carrinho_id = $3 RETURNING id, produto_id, quantidade",
        item_update.quantidade,
        item_id,
        carrinho_id,
    )
    await conn.close()
    if not row:
        raise KeyError("Item do carrinho não encontrado")
    return CartItemOut(**row)


async def checkout(cart_id: int):
    conn = await get_connection()
    async with conn.transaction():
        items = await conn.fetch(
            "SELECT produto_id, quantidade FROM itens_carrinho WHERE carrinho_id = $1",
            cart_id,
        )
        if not items:
            raise ValueError("Carrinho está vazio")

        for item in items:
            product = await conn.fetchrow(
                "SELECT quantity FROM produtos WHERE id = $1 FOR UPDATE",
                item["produto_id"],
            )
            if not product or product["quantity"] < item["quantidade"]:
                raise ValueError(
                    f"Estoque insuficiente para o produto ID {item['produto_id']}"
                )

            new_quantity = product["quantity"] - item["quantidade"]
            await conn.execute(
                "UPDATE produtos SET quantity = $1 WHERE id = $2",
                new_quantity,
                item["produto_id"],
            )

        await conn.execute("DELETE FROM itens_carrinho WHERE carrinho_id = $1", cart_id)

    await conn.close()
    return {"message": "Compra finalizada com sucesso!"}


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
