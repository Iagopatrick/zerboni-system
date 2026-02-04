import { pool } from "../../../database";

export class FiscalReportRepository {
  // Passos 3 e 6: Listar movimentos com filtros de data e tipo
  async findRecords(filters: {
    startDate?: string;
    endDate?: string;
    type?: number;
  }) {
    let query = `
      SELECT id, date, value, movement_type, identifier, description 
      FROM fiscal_records 
      WHERE 1=1
    `;
    const values: any[] = [];

    if (filters.startDate) {
      values.push(filters.startDate);
      query += ` AND date >= $${values.length}`;
    }
    if (filters.endDate) {
      values.push(filters.endDate);
      query += ` AND date <= $${values.length}`;
    }
    if (filters.type) {
      values.push(filters.type);
      query += ` AND movement_type = $${values.length}`;
    }

    query += " ORDER BY date DESC";

    const { rows } = await pool.query(query, values);
    return rows;
  }
}
