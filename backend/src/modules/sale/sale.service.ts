import { SaleRepository } from "./sale.repository";
import { CustomerService } from "../customer/customer.service";
import { CustomerPaymentType, SaleType } from "./sale.controller";

export class SaleService {
  private repository = new SaleRepository();
  private customerService = new CustomerService();

  async createSale(data: {
    cpf: string;
    items: Array<{
      productId: string;
      quantity: number;
      unitPrice: number; // Permite o cálculo do total
    }>;
    paymentType: number;
    saleType: number;
    sellerId: string;
  }) {
    // Pré-condição: Validar se o cliente existe
    const result = await this.customerService.listCustomersWithFilters({
      cpf: data.cpf,
    });

    if (result.length === 0) {
      throw new Error("Cliente não encontrado");
    }

    const customerId = result[0].id;

    // Cálculo do valor total (Base para RN04)
    let totalValue = data.items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0,
    );

    // Aplicação da RN04 (Descontos)
    // De acordo com o diagrama: DINHEIRO = 1, PIX = 5 (exemplo de valores do enum)
    if (data.paymentType === 1 || data.paymentType === 5) {
      totalValue *= 0.9; // 10% de desconto
    }

    // Registro no Banco de Dados
    // O status 1 representa 'FECHADO' conforme o diagrama de classes
    const sale = await this.repository.registerSale({
      ...data,
      customerId,
      paymentType: data.paymentType,
      saleType: data.saleType,
      totalValue,
      status: 1,
    });

    return sale;
  }

  async listAllSales() {
    return this.repository.listSales();
  }

  async getSaleById(id: number) {
    const sale = await this.repository.getSaleById(id);

    if (!sale) {
      throw new Error("Venda não encontrada");
    }

    return sale;
  }

  // UC05 - Fluxo de Vitrine Virtual (Filtro por Telefone)
  async listInterests(phoneNumber?: string) {
    return this.repository.listInterests(phoneNumber);
  }

  // UC05 - Fluxo de Venda Condicional (Filtro por CPF)
  async listConditionals(cpf?: string) {
    return this.repository.listConditionals(cpf);
  }

    async listSales(options?: {
    id?: string;
    customerId?: string;
    fiscalRecordId?: string;
  }) {
    return this.repository.listSales(options);
  }

  async listFiscalRecords(): Promise<
    {
      id: string;
      date: Date;
      value: number;
      movement_type: number;
      identifier: string;
      description?: string;
      created_at: Date;
    }[]
  > {
    return this.repository.listFiscalRecords();
  }
}
