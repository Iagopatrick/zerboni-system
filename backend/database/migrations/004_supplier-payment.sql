BEGIN;

CREATE TABLE IF NOT EXISTS supplier_payments (
  id SERIAL PRIMARY KEY,

  supplier_id INT NOT NULL,
  payment_date DATE NOT NULL,
  amount NUMERIC(12,2) NOT NULL,

  payment_type VARCHAR NOT NULL,
  movement_type VARCHAR NOT NULL,

  description TEXT,

  created_at TIMESTAMP DEFAULT now(),

  CONSTRAINT fk_supplier
    FOREIGN KEY (supplier_id)
    REFERENCES suppliers(id)
    ON DELETE RESTRICT,

  CONSTRAINT check_positive_amount
    CHECK (amount > 0),

  CONSTRAINT check_payment_type
    CHECK (payment_type IN (
      'Dinheiro',
      'Cheque',
      'Cartao_credito',
      'Cartao_debito',
      'Pix',
      'Transferencia_bancaria'
    )),

  CONSTRAINT check_movement_type
    CHECK (movement_type IN (
      'Entrada',
      'Saida'
    ))
);

COMMIT;
