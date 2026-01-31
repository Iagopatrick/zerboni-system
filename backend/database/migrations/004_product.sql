BEGIN;

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  registration_id TEXT UNIQUE NOT NULL,
  branch TEXT DEFAULT 'Marilândia' NOT NULL ,
  product_group TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT,
  reference TEXT NOT NULL,
  price TEXT NOT NULL,
  stock INT DEFAULT 0 NOT NULL,
  product_type TEXT,
  unit_of_measure INT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  trade_name TEXT,
  active BOOLEAN DEFAULT TRUE NOT NULL,
  size TEXT,
  supplier_cnpj CHAR(14) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),

  CONSTRAINT fk_supplier FOREIGN KEY (supplier_cnpj) REFERENCES suppliers(cnpj)
);

COMMIT;