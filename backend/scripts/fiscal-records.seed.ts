import { pool } from "../database";

type FiscalExpenseInput = {
  date?: Date;
  value: number;
  movementType: 2 | 3; // 2 = SAÍDA | 3 = DEVOLUÇÃO
  identifier: string;
  description?: string;
  saleId?: number;
};

export async function createFiscalExpense({
  date = new Date(),
  value,
  movementType,
  identifier,
  description,
  saleId,
}: FiscalExpenseInput) {
  if (![2, 3].includes(movementType)) {
    throw new Error('movementType inválido. Use 2 (SAÍDA) ou 3 (DEVOLUÇÃO)');
  }
  if(!!saleId){
     const result = await pool.query(
    `
    INSERT INTO fiscal_records (
      date,
      value,
      movement_type,
      sale_id,
      identifier,
      description
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      date,
      value,
      movementType,
      saleId ?? null,
      identifier,
      description ?? null,
    ]
  );
  return result.rows[0];
  }
  const result = await pool.query(
    `
    INSERT INTO fiscal_records (
      date,
      value,
      movement_type,
      identifier,
      description
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      date,
      value,
      movementType,
      identifier,
      description ?? null,
    ]
  );

  return result.rows[0];
}