import { pool } from "../../../database";

export type PaymentType =
  | "Dinheiro"
  | "Cheque"
  | "Cartao_credito"
  | "Cartao_debito"
  | "Pix"
  | "Transferencia_bancaria";

export type MovementType =
  | "Entrada"
  | "Saida";

export interface SupplierPayment {
  id: string;
  supplierId: number;
  paymentDate: Date;
  amount: number;
  paymentType: PaymentType;
  movementType: MovementType;
  description?: string;
  created_at: Date;
}

export class SupplierPaymentRepository {

  async findWithFilters(options?: {
    id?: string;
    supplierId?: string;
    paymentType?: PaymentType;
    movementType?: MovementType;
    startDate?: string;
    endDate?: string;
  }): Promise<SupplierPayment[]> {

    let query = `
      SELECT 
        id,
        supplier_id AS "supplierId",
        payment_date AS "paymentDate",
        amount,
        payment_type AS "paymentType",
        movement_type AS "movementType",
        description,
        created_at
      FROM supplier_payments
      WHERE 1 = 1
    `;

    const values: any[] = [];
    let counter = 1;

    if (options?.id) {
      query += ` AND id = $${counter}`;
      values.push(options.id);
      counter++;
    }

    if (options?.supplierId) {
      query += ` AND supplier_id = $${counter}`;
      values.push(options.supplierId);
      counter++;
    }

    if (options?.paymentType) {
      query += ` AND payment_type = $${counter}`;
      values.push(options.paymentType);
      counter++;
    }

    if (options?.movementType) {
      query += ` AND movement_type = $${counter}`;
      values.push(options.movementType);
      counter++;
    }

    if (options?.startDate) {
      query += ` AND payment_date >= $${counter}`;
      values.push(options.startDate);
      counter++;
    }

    if (options?.endDate) {
      query += ` AND payment_date <= $${counter}`;
      values.push(options.endDate);
      counter++;
    }

    query += ` ORDER BY payment_date DESC`;

    const { rows } = await pool.query(query, values);
    return rows;
  }

  async create(
    data: Omit<SupplierPayment, "id" | "created_at">
  ): Promise<SupplierPayment> {

    const { rows } = await pool.query(
      `
      INSERT INTO supplier_payments (
        supplier_id,
        payment_date,
        amount,
        payment_type,
        movement_type,
        description
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        supplier_id AS "supplierId",
        payment_date AS "paymentDate",
        amount,
        payment_type AS "paymentType",
        movement_type AS "movementType",
        description,
        created_at
      `,
      [
        data.supplierId,
        data.paymentDate,
        data.amount,
        data.paymentType,
        data.movementType,
        data.description
      ]
    );

    return rows[0];
  }

  async update(
    id: number,
    data: Partial<SupplierPayment>
  ): Promise<SupplierPayment | null> {

    const fields: string[] = [];
    const values: any[] = [];
    let counter = 1;

    if (data.supplierId !== undefined) {
      fields.push(`supplier_id = $${counter++}`);
      values.push(data.supplierId);
    }

    if (data.paymentDate !== undefined) {
      fields.push(`payment_date = $${counter++}`);
      values.push(data.paymentDate);
    }

    if (data.amount !== undefined) {
      fields.push(`amount = $${counter++}`);
      values.push(data.amount);
    }

    if (data.paymentType !== undefined) {
      fields.push(`payment_type = $${counter++}`);
      values.push(data.paymentType);
    }

    if (data.movementType !== undefined) {
      fields.push(`movement_type = $${counter++}`);
      values.push(data.movementType);
    }

    if (data.description !== undefined) {
      fields.push(`description = $${counter++}`);
      values.push(data.description);
    }

    if (fields.length === 0) {
      return null;
    }

    const query = `
      UPDATE supplier_payments
      SET ${fields.join(', ')}
      WHERE id = $${counter}
      RETURNING
        id,
        supplier_id AS "supplierId",
        payment_date AS "paymentDate",
        amount,
        payment_type AS "paymentType",
        movement_type AS "movementType",
        description,
        created_at
    `;

    values.push(id);

    const { rows } = await pool.query(query, values);
    return rows[0] ?? null;
  }

  async delete(id: number): Promise<void> {
    await pool.query(
      "DELETE FROM supplier_payments WHERE id = $1",
      [id]
    );
  }
}
