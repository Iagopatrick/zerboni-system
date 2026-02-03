BEGIN;

-- Tabela Pai: Registros Fiscais
CREATE TABLE IF NOT EXISTS fiscal_records (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    value DECIMAL(10, 2) NOT NULL,
    movement_type INT NOT NULL, -- 1: ENTRADA, 2: SAIDA
    identifier TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Tabela Filha: Venda (Especialização de Registro Fiscal)
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    fiscal_record_id INT UNIQUE NOT NULL REFERENCES fiscal_records(id) ON DELETE CASCADE,
    customer_id INT NOT NULL REFERENCES customers(id),
    user_id INT NOT NULL REFERENCES users(id),
    payment_type INT NOT NULL,  -- ENUM: Dinheiro, Pix, Cartão...
    sale_type INT NOT NULL,     -- ENUM: Normal, Interesse, Condicional
    status_type INT NOT NULL DEFAULT 0, -- ENUM: 0 (Aberto), 1 (Fechado)
    total_value DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Tabela de Itens (Relação "Constitui" entre Venda e Produto)
CREATE TABLE IF NOT EXISTS sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL -- Preço praticado no momento da venda
);

COMMIT;