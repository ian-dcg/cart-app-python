from fastapi import APIRouter, HTTPException

from app.domains.cart.model import (CartCreate, CartItemCreate, CartItemOut,
                                    CartOut)
from app.domains.cart.service import (add_item_to_cart, create_cart,
                                      delete_cart, get_cart, list_all_carts,
                                      remove_item_from_cart)

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


@router.delete("/{cart_id}/items/{item_id}", status_code=204)
async def remove_item(cart_id: int, item_id: int):
    success = await remove_item_from_cart(cart_id, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Item do carrinho não encontrado")
    return


@router.get("/{cart_id}", response_model=CartOut)
async def get_cart_info(cart_id: int):
    try:
        return await get_cart(cart_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Carrinho não encontrado")


@router.get("/", response_model=list[CartOut])
async def get_all_carts():
    return await list_all_carts()


@router.delete("/{cart_id}", status_code=204)
async def delete_cart_route(cart_id: int):
    deleted = await delete_cart(cart_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Carrinho não encontrado")


@router.get("/{cart_id}/total")
async def get_cart_total(cart_id: int):
    try:
        from app.domains.cart.service import calcular_total_carrinho

        return await calcular_total_carrinho(cart_id)
    except Exception:
        raise HTTPException(
            status_code=400, detail="Erro ao calcular total do carrinho"
        )
