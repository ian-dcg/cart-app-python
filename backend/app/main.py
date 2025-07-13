from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.domains.auth.route import router as auth_router
from app.domains.cart.route import router as cart_router
from app.domains.product.route import router as product_router

app = FastAPI()

# Lista de origens permitidas
origins = [
    "http://localhost:3000",  # frontend Next.js
    "http://localhost:8080",
    "http://localhost",
]

# Adiciona o middleware de CORS ao aplicativo
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permite as origens da lista
    allow_credentials=True,  # Permite cookies/autenticação
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

@app.get("/")
def hello_world():
    return {"message": "Hello World!"}


app.include_router(product_router)
app.include_router(cart_router)
app.include_router(auth_router)
