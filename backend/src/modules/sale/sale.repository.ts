import { pool } from "../../../database";

export class SaleRepository {
  async registerSale(data: any) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Inserir na tabela pai: Registros Fiscais (Classe Registros Fiscais)
      const fiscalQuery = `
        INSERT INTO fiscal_records (value, movement_type, identifier, description)
        VALUES ($1, 1, $2, $3) RETURNING id
      `;
      const fiscalResult = await client.query(fiscalQuery, [
        data.totalValue,
        `VENDA-${Date.now()}`,
        "Registro de venda de produtos",
      ]);
      const fiscalId = fiscalResult.rows[0].id;

      // Inserir na tabela filha: Venda (Classe Venda)
      const saleQuery = `
        INSERT INTO sales (
          fiscal_record_id, customer_id, user_id, 
          payment_type, sale_type, status_type, total_value
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
      `;
      const saleResult = await client.query(saleQuery, [
        fiscalId,
        data.customerId,
        data.sellerId,
        data.paymentType,
        data.saleType,
        1, // status: FECHADO (após finalizar)
        data.totalValue,
      ]);

      const saleId = saleResult.rows[0].id;

      // Itens da Venda e Atualização de Estoque (Associação Constitui)
      for (const item of data.items) {
        await client.query(
          "INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)",
          [saleId, item.productId, item.quantity, item.unitPrice],
        );

        // RN07 - Atualizar estoque (Garante estoque > 0)
        const stockResult = await client.query(
          "UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1",
          [item.quantity, item.productId],
        );

        if (stockResult.rowCount === 0) {
          throw new Error(
            `Estoque insuficiente ou produto ${item.productId} não encontrado.`,
          );
        }
      }

      await client.query("COMMIT");
      return saleResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async listConditionals(cpf?: string) {
    let query = `
    SELECT s.*, c.name, c.cpf 
    FROM sales s
    JOIN customers c ON s.customer_id = c.id
    WHERE s.sale_type = 3 AND s.status_type = 0
  `; // sale_type 3 = Condicional conforme o diagrama

    const values = [];
    if (cpf) {
      query += " AND c.cpf = $1";
      values.push(cpf.replace(/\D/g, ""));
    }

    const { rows } = await pool.query(query, values);
    return rows;
  }

  // Métodos de busca para os Fluxos de Evento (Interesse e Condicional)
  async listInterests(phone?: string) {
    const query =
      "SELECT * FROM sales_interests WHERE status = 'OPEN'" +
      (phone ? " AND customer_phone = $1" : "");
    const { rows } = await pool.query(query, phone ? [phone] : []);
    return rows;
  }
}
