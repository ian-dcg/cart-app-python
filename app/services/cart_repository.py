import asyncpg
from app.settings import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
from app.models.cart_model import CartItemCreate, CartItemOut, CartOut

async def get_connection():
    return await asyncpg.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        host=DB_HOST,
        port=DB_PORT
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
        carrinho_id, item.produto_id, item.quantidade
    )
    await conn.close()
    return CartItemOut(**row)

async def get_cart(carrinho_id: int) -> CartOut:
    conn = await get_connection()
    cart = await conn.fetchrow("SELECT id FROM carrinhos WHERE id = $1", carrinho_id)
    if not cart:
        await conn.close()
        raise KeyError("Carrinho não encontrado")

    rows = await conn.fetch("SELECT id, produto_id, quantidade FROM itens_carrinho WHERE carrinho_id = $1", carrinho_id)
    await conn.close()
    items = [CartItemOut(**r) for r in rows]
    return CartOut(id=carrinho_id, items=items)

async def list_all_carts() -> list[CartOut]:
    conn = await get_connection()
    cart_rows = await conn.fetch("SELECT id FROM carrinhos")
    all_carts = []
    for row in cart_rows:
        cart_id = row["id"]
        item_rows = await conn.fetch("SELECT id, produto_id, quantidade FROM itens_carrinho WHERE carrinho_id = $1", cart_id)
        items = [CartItemOut(**item) for item in item_rows]
        all_carts.append(CartOut(id=cart_id, items=items))
    await conn.close()
    return all_carts
