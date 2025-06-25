import asyncpg
from fastapi import FastAPI

import app.settings as settings
from app.domains.auth.route import router as auth_router
from app.domains.cart.route import router as cart_router
from app.domains.product.route import router as product_router

app = FastAPI()


# Rotas básicas
@app.get("/")
def hello_world():
    return {"message": "Hello World!"}


@app.get("/db-test")
async def test_db():
    conn = await asyncpg.connect(
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        database=settings.DB_NAME,
        host=settings.DB_HOST,
        port=settings.DB_PORT,
    )
    await conn.execute("CREATE TABLE IF NOT EXISTS ping (id SERIAL PRIMARY KEY)")
    await conn.close()
    return {"status": "ok"}


# Registro de novas rotas de produto
app.include_router(product_router)
app.include_router(cart_router)
app.include_router(auth_router)
