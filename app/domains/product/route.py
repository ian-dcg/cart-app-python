from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.domains.product.model import ProductCreate, ProductInDB, ProductUpdate
from app.domains.product.service import (create_product, delete_product,
                                         get_product, list_products,
                                         update_product)

router = APIRouter(prefix="/products", tags=["Produtos"])


@router.get("/", response_model=list[ProductInDB])
async def get_all(
    setor: Optional[str] = Query(default=None),
    nome: Optional[str] = Query(default=None),
):
    return await list_products(setor=setor, nome=nome)


@router.get("/{product_id}", response_model=ProductInDB)
async def get_by_id(product_id: int):
    try:
        return await get_product(product_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Produto não encontrado")


@router.post("/", response_model=ProductInDB, status_code=201)
async def create(data: ProductCreate):
    return await create_product(data)


@router.put("/{product_id}", response_model=ProductInDB)
async def update(product_id: int, data: ProductUpdate):
    try:
        return await update_product(product_id, data)
    except KeyError:
        raise HTTPException(status_code=404, detail="Produto não encontrado")


@router.delete("/{product_id}", status_code=204)
async def delete(product_id: int):
    try:
        await delete_product(product_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
