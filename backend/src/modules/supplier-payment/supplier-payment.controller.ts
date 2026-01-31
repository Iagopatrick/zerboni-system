import { FastifyInstance } from "fastify";
import { SupplierPaymentService } from "./supplier-payment.service";

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

export async function supplierPaymentRoutes(app: FastifyInstance) {
  const service = new SupplierPaymentService();

  /**
   * Listar pagamentos de fornecedor
   * Pode receber filtros via query string
   */
  app.get("/", async (request, reply) => {
    try {
      const filters = request.query as any;
      const payments = await service.listPayments(filters);
      return payments;
    } catch (err: any) {
      reply.code(500);
      return {
        message: "Erro ao listar pagamentos de fornecedores",
        error: err.message,
      };
    }
  });

  /**
   * Criar pagamento de fornecedor
   */
  app.post("/", async (request, reply) => {
    type CreateSupplierPaymentBody = {
      supplierId: number;
      paymentDate: string; // YYYY-MM-DD
      amount: number;
      paymentType: PaymentType;
      movementType: MovementType;
      description?: string;
    };

    const data = request.body as CreateSupplierPaymentBody;

    try {
      const payment = await service.createPayment(data);
      reply.code(201);
      return payment;
    } catch (err: any) {
      reply.code(400);
      return {
        message: "Erro ao registrar pagamento de fornecedor",
        error: err.message,
      };
    }
  });

  /**
   * Atualizar pagamento
   */
  app.put("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as any;

    try {
      const updatedPayment = await service.updatePayment(Number(id), data);
      return updatedPayment;
    } catch (err: any) {
      reply.code(400);
      return { message: err.message };
    }
  });

  /**
   * Excluir pagamento
   */
  app.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await service.deletePayment(Number(id));
      return reply.code(204).send();
    } catch (err: any) {
      reply.code(400);
      return { message: err.message };
    }
  });
}
