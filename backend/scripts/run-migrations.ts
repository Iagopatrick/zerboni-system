import fs from "fs";
import path from "path";
import { pool } from "../database/index";

const migrationsDir = path.resolve(__dirname, "../database/migrations");

async function resetDatabase() {
  console.log("🔥 Resetando banco de dados...");

  await pool.query(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      -- apagar todas as tabelas do schema public
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `);

  console.log("♻️ Banco resetado");
}

async function runMigrations() {
  await resetDatabase();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT now()
    );
  `);

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(
      path.join(migrationsDir, file),
      "utf-8"
    );

    console.log(`▶️ Rodando migration: ${file}`);
    await pool.query(sql);

    await pool.query(
      "INSERT INTO migrations (filename) VALUES ($1)",
      [file]
    );
  }

  console.log("✅ Migrations executadas com sucesso");
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error("❌ Erro ao rodar migrations:", err);
  process.exit(1);
});
