from typing import Optional

from pydantic import BaseModel, Field


class CartCreate(BaseModel):
    pass  # Carrinho é criado vazio


class CartItemCreate(BaseModel):
    produto_id: int
    quantidade: int = Field(..., gt=0, description="Quantidade deve ser maior que 0")


class CartItemUpdate(BaseModel):
    quantidade: int = Field(..., gt=0, description="Quantidade deve ser maior que 0")


class CartItemOut(BaseModel):
    id: int
    produto_id: int
    quantidade: int


class CartOut(BaseModel):
    id: int
    items: list[CartItemOut]
