import asyncpg
from app.models.product_model import ProductInDB, ProductCreate, ProductUpdate
from app.settings import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

async def get_connection():
    return await asyncpg.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        host=DB_HOST,
        port=DB_PORT
    )

async def create_product(data: ProductCreate) -> ProductInDB:
    conn = await get_connection()
    row = await conn.fetchrow(
        "INSERT INTO produtos (name, price, quantity) VALUES ($1, $2, $3) RETURNING id, name, price, quantity",
        data.name, data.price, data.quantity
    )
    await conn.close()
    return ProductInDB(**row)

async def get_product(product_id: int) -> ProductInDB:
    conn = await get_connection()
    row = await conn.fetchrow(
        "SELECT id, name, price, quantity FROM produtos WHERE id = $1",
        product_id
    )
    await conn.close()
    if row:
        return ProductInDB(**row)
    raise KeyError("Produto não encontrado")

async def list_products() -> list[ProductInDB]:
    conn = await get_connection()
    rows = await conn.fetch("SELECT id, name, price, quantity FROM produtos")
    await conn.close()
    return [ProductInDB(**row) for row in rows]

async def update_product(product_id: int, data: ProductUpdate) -> ProductInDB:
    conn = await get_connection()
    existing = await conn.fetchrow("SELECT * FROM produtos WHERE id = $1", product_id)
    if not existing:
        await conn.close()
        raise KeyError("Produto não encontrado")

    update_fields = []
    values = []
    index = 1
    for field, value in data.model_dump(exclude_unset=True).items():
        update_fields.append(f"{field} = ${index}")
        values.append(value)
        index += 1
    values.append(product_id)

    await conn.execute(
        f"UPDATE produtos SET {', '.join(update_fields)} WHERE id = ${index}",
        *values
    )
    updated = await conn.fetchrow("SELECT id, name, price, quantity FROM produtos WHERE id = $1", product_id)
    await conn.close()
    return ProductInDB(**updated)

async def delete_product(product_id: int) -> None:
    conn = await get_connection()
    result = await conn.execute("DELETE FROM produtos WHERE id = $1", product_id)
    await conn.close()
    if result == "DELETE 0":
        raise KeyError("Produto não encontrado")
