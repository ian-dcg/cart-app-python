from fastapi import APIRouter, HTTPException
from app.models.cart_model import CartCreate, CartItemCreate, CartOut, CartItemOut
from app.services.cart_repository import create_cart, add_item_to_cart, get_cart

router = APIRouter(prefix="/cart", tags=["Carrinho"])

@router.post("/", response_model=int)
async def create_empty_cart():
    return await create_cart()

@router.post("/{cart_id}/items", response_model=CartItemOut)
async def add_item(cart_id: int, item: CartItemCreate):
    try:
        return await add_item_to_cart(cart_id, item)
    except Exception:
        raise HTTPException(status_code=400, detail="Erro ao adicionar item")

@router.get("/{cart_id}", response_model=CartOut)
async def get_cart_info(cart_id: int):
    try:
        return await get_cart(cart_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Carrinho não encontrado")
