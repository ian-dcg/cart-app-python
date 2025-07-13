
CREATE TABLE IF NOT EXISTS carrinhos (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS itens_carrinho (
    id SERIAL PRIMARY KEY,
    carrinho_id INTEGER REFERENCES carrinhos(id) ON DELETE CASCADE,
    produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0)
);
