import fs from "fs";
import path from "path";
import { pool } from "../database/index";

const migrationsDir = path.resolve(__dirname, "../database/migrations");

async function runMigrations() {
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
    const alreadyExecuted = await pool.query(
      "SELECT 1 FROM migrations WHERE filename = $1",
      [file]
    );

    if (alreadyExecuted.rowCount) {
      continue;
    }

    const sql = fs.readFileSync(
      path.join(migrationsDir, file),
      "utf-8"
    );

    console.log(`Running migration: ${file}`);

    await pool.query(sql);
    await pool.query(
      "INSERT INTO migrations (filename) VALUES ($1)",
      [file]
    );
  }

  console.log("Migrations completed");
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error(err);
  process.exit(1);
});
