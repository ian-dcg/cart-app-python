from typing import Optional
from pydantic import BaseModel

class ProductInDB(BaseModel):
    id: int
    name: str
    price: float
    quantity: int

class ProductCreate(BaseModel):
    name: str
    price: float
    quantity: int

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
