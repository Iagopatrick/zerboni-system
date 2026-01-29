import fs from "fs";
import path from "path";

const migrationsDir = path.resolve(
  __dirname,
  "../database/migrations"
);

const name = process.argv[2];

if (!name) {
  console.error("Usage: pnpm migrate:create <migration_name>");
  process.exit(1);
}

// Garante que a pasta existe
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

// Lê migrations existentes
const files = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

// Calcula próximo número
let nextNumber = 1;

if (files.length > 0) {
  const lastFile = files[files.length - 1];
  const match = lastFile.match(/^(\d+)_/);

  if (match) {
    nextNumber = Number(match[1]) + 1;
  }
}

const paddedNumber = String(nextNumber).padStart(3, "0");
const fileName = `${paddedNumber}_${name}.sql`;
const filePath = path.join(migrationsDir, fileName);

// Conteúdo inicial da migration
const template = `-- Migration: ${fileName}
-- Created at: ${new Date().toISOString()}

BEGIN;

-- Write your SQL here

COMMIT;
`;

fs.writeFileSync(filePath, template);

console.log(`Migration created: ${fileName}`);
