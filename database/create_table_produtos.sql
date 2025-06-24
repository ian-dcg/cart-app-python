CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    setor TEXT NOT NULL DEFAULT 'Hortifruti' CHECK (
        setor IN ('Hortifruti', 'Açougue', 'Padaria', 'Limpeza', 'Bebidas')
    )
);
