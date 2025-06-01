from pydantic import BaseModel
from typing import Optional

class CartCreate(BaseModel):
    pass  # Carrinho é criado vazio

class CartItemCreate(BaseModel):
    produto_id: int
    quantidade: int

class CartItemOut(BaseModel):
    id: int
    produto_id: int
    quantidade: int

class CartOut(BaseModel):
    id: int
    items: list[CartItemOut]
