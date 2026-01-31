import { SupplierPaymentRepository } from "./supplier-payment.repository";

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

export class SupplierPaymentService {
  private repository = new SupplierPaymentRepository();

  async listPayments(filters?: {
    id?: string;
    supplierId?: string;
    paymentType?: PaymentType;
    movementType?: MovementType;
    startDate?: string;
    endDate?: string;
  }) {
    return this.repository.findWithFilters(filters);
  }

  async createPayment(data: {
    supplierId: number;
    paymentDate: string;
    amount: number;
    paymentType: PaymentType;
    movementType: MovementType;
    description?: string;
  }) {
    // Regra de negócio: valor deve ser positivo
    if (data.amount <= 0) {
      throw new Error("O valor do pagamento deve ser maior que zero.");
    }

    // Regra de negócio: tipo de pagamento
    if (data.paymentType !== "Dinheiro" && 
        data.paymentType !== "Cheque" && 
        data.paymentType !== "Cartao_credito" && 
        data.paymentType !== "Cartao_debito" && 
        data.paymentType !== "Pix" && 
        data.paymentType !== "Transferencia_bancaria") {
      throw new Error("Pagamentos a fornecedores devem ser do tipo 'Dinheiro', 'Cheque', 'Cartao_credito', 'Cartao_debito', 'Pix' ou 'Transferencia_bancaria'.");
    }
    
    // Regra de negócio: saída para fornecedor
    if (data.movementType !== "Saida") {
      throw new Error("Pagamentos a fornecedores devem ser do tipo 'Saida'.");
    }

    // Normalização
    const normalizedDate = new Date(data.paymentDate);

    if (isNaN(normalizedDate.getTime())) {
      throw new Error("Data de pagamento inválida.");
    }

    return this.repository.create({
      supplierId: data.supplierId,
      paymentDate: normalizedDate,
      amount: data.amount,
      paymentType: data.paymentType,
      movementType: data.movementType,
      description: data.description || undefined,
    });
  }

  async updatePayment(id: number, data: any) {
    const payments = await this.repository.findWithFilters({ id: String(id) });

    if (payments.length === 0) {
      throw new Error("Pagamento não encontrado.");
    }

    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error("O valor do pagamento deve ser maior que zero.");
    }

    if (data.paymentDate) {
      const parsedDate = new Date(data.paymentDate);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Data de pagamento inválida.");
      }
      data.paymentDate = parsedDate;
    }

    return this.repository.update(id, data);
  }

  async deletePayment(id: number) {
    const payments = await this.repository.findWithFilters({ id: String(id) });

    if (payments.length === 0) {
      throw new Error("Pagamento não encontrado para exclusão.");
    }

    await this.repository.delete(id);
  }
}
