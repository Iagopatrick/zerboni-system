import { pool } from "../../../database";

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

interface FindAllParams {
  search?: string;
  page?: number;
  limit?: number;
}

interface PaginatedResult<T> {
  rows: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class UserRepository {
  async findAll({ search = "", page = 1, limit = 10 }: FindAllParams) {
    let offset: number;

    // Query de contagem para saber total de registros
    const countQuery = search
      ? `SELECT COUNT(*) AS total FROM users WHERE name ILIKE $1 OR email ILIKE $1`
      : `SELECT COUNT(*) AS total FROM users`;

    const countValues = search ? [`%${search}%`] : [];
    const countResult = await pool.query(countQuery, countValues);
    const total = parseInt(countResult.rows[0].total, 10);

    // Calcula total de páginas
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // Garante que a página solicitada não ultrapasse o total
    const safePage = Math.min(page, totalPages);

    offset = (safePage - 1) * limit;

    // Query de dados
    let dataQuery: string;
    let dataValues: any[];

    if (search) {
      dataQuery = `
        SELECT id, name, email, created_at
        FROM users
        WHERE name ILIKE $1 OR email ILIKE $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
      dataValues = [`%${search}%`, limit, offset];
    } else {
      dataQuery = `
        SELECT id, name, email, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      dataValues = [limit, offset];
    }

    const dataResult = await pool.query(dataQuery, dataValues);

    return {
      rows: dataResult.rows,
      total,
      page: safePage,
      limit,
      totalPages,
    };
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

  async update(id: string, data: { name?: string; email?: string }): Promise<User | null> {
    const fields = [];
    const values: any[] = [];
    let counter = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${counter}`);
      values.push(data.name);
      counter++;
    }
    if (data.email !== undefined) {
      fields.push(`email = $${counter}`);
      values.push(data.email);
      counter++;
    }

    if (fields.length === 0) return this.findById(id); // nada para atualizar

    values.push(id); // último parâmetro é o ID
    const query = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${counter}
      RETURNING id, name, email, created_at
    `;
    const { rows } = await pool.query(query, values);
    return rows[0] ?? null;
  }


  async delete(id: string): Promise<void> {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  }
}