-- Migration: 001_user.sql
-- Created at: 2026-01-29T00:53:58.492Z

BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);

COMMIT;
