import { pool } from "../../../database";

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

export class UserRepository {
  async findAll(): Promise<User[]> {
    const { rows } = await pool.query(
      "SELECT id, name, email, created_at FROM users"
    );
    return rows;
  }

  async findById(id: string): Promise<User | null> {
    const { rows } = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [id]
    );
    return rows[0] ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    return rows[0] ?? null;
  }

  async create(data: { name: string; email: string }): Promise<User> {
    const { rows } = await pool.query(
      `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING id, name, email, created_at
      `,
      [data.name, data.email]
    );

    return rows[0];
  }

  async delete(id: string): Promise<void> {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  }
}