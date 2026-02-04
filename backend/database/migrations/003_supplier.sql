BEGIN;

CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  legal_name TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE NOT NULL,
  cep CHAR(8) NOT NULL,
  street TEXT NOT NULL,
  street_number INT NOT NULL,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  phone_number CHAR(11) NOT NULL,
  fax CHAR(11),
  cnpj CHAR(14) NOT NULL UNIQUE,
  producer_tax_id VARCHAR(50),
  municipal_tax_id VARCHAR(50),
  state_tax_id VARCHAR(50),
  website TEXT,
  email TEXT NOT NULL UNIQUE,
  invoce_email TEXT UNIQUE,
  cash_account VARCHAR(29) NOT NULL,
  tax_regime VARCHAR NOT NULL,
  payment_methods TEXT[] NOT NULL DEFAULT ARRAY['Dinheiro'], 
  notes text,
  created_at TIMESTAMP DEFAULT now(),

  CONSTRAINT at_least_one_registration CHECK (
    producer_tax_id IS NOT NULL OR 
    state_tax_id IS NOT NULL OR 
    municipal_tax_id IS NOT NULL
  ),

  CONSTRAINT check_tax_regime CHECK (
    tax_regime IN ('Simples Nacional', 'Lucro Presumido', 'Lucro Real')
  ),

  CONSTRAINT check_payment_methods_list CHECK (
        payment_methods <@ ARRAY[
            'Dinheiro', 
            'Cheque', 
            'Cartao_credito', 
            'Cartao_debito', 
            'Pix'
        ]::TEXT[]
    )
);

COMMIT;
