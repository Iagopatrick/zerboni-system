BEGIN;

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cpf CHAR(11) UNIQUE NOT NULL,
  cep CHAR(8) NOT NULL,
  street TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  state TEXT NOT NULL,
  street_number INT NOT NULL,
  phone_number CHAR(11) NOT NULL, 
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);

COMMIT;
