import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ ERRO AO CONECTAR NO POSTGRES:", err.message);
  } else {
    console.log("✅ CONEXÃO COM O BANCO ESTABELECIDA EM:", res.rows[0].now);
  }
});
