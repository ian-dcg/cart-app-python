from fastapi import APIRouter, HTTPException
from app.models.product_model import ProductInDB, ProductCreate, ProductUpdate
from app.services.product_repository import (
    create_product,
    get_product,
    list_products,
    update_product,
    delete_product
)

router = APIRouter(prefix="/products", tags=["Produtos"])

@router.get("/", response_model=list[ProductInDB])
async def get_all():
    return await list_products()

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
