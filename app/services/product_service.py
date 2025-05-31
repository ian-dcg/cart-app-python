from app.models.product_model import ProductInDB, ProductCreate, ProductUpdate

# Simulando base de dados em memória
fake_db = {}
counter = 1

def create_product(data: ProductCreate) -> ProductInDB:
    global counter
    product = ProductInDB(id=counter, **data.dict())
    fake_db[counter] = product
    counter += 1
    return product

def get_product(product_id: int) -> ProductInDB:
    return fake_db[product_id]

def list_products() -> list[ProductInDB]:
    return list(fake_db.values())

def update_product(product_id: int, data: ProductUpdate) -> ProductInDB:
    existing = fake_db[product_id]
    updated = existing.copy(update=data.dict(exclude_unset=True))
    fake_db[product_id] = updated
    return updated

def delete_product(product_id: int) -> None:
    del fake_db[product_id]
