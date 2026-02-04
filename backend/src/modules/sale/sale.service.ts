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
    paymentType: CustomerPaymentType;
    saleType: SaleType;
    sellerId: string;
  }) {
    const paymentMapping: Record<CustomerPaymentType, number> = {
      Dinheiro: 1,
      Pix: 5,
      Cartao_Debito: 2,
      Cartao_Credito: 3,
      Crediario: 4,
    };

    const typeMapping: Record<SaleType, number> = {
      Normal: 1,
      Interesse: 2,
      Condicional: 3,
    };

    // Pré-condição: Validar se o cliente existe
    const customer = await this.customerService.listCustomers({
      cpf: data.cpf, // Tem que adicionar o campo id no filtro do CustomerService ""
    });

    if (customer.length === 0) {
      throw new Error("Cliente não encontrado");
    }

    // Cálculo do valor total (Base para RN04)
    let totalValue = data.items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0,
    );

    // Aplicação da RN04 (Descontos)
    // De acordo com o diagrama: DINHEIRO = 1, PIX = 5 (exemplo de valores do enum)
    if (data.paymentType === "Dinheiro" || data.paymentType === "Pix") {
      totalValue *= 0.9; // 10% de desconto
    }

    // Registro no Banco de Dados
    // O status 1 representa 'FECHADO' conforme o diagrama de classes
    const sale = await this.repository.registerSale({
      ...data,
      paymentType: paymentMapping[data.paymentType],
      saleType: typeMapping[data.saleType],
      totalValue,
      status: 1,
    });

    return sale;
  }

  async listAllSales() {
    return this.repository.listAllSales();
  }

  async getSaleById(id: number) {
    const sale = await this.repository.findById(id);
    if (!sale) throw new Error("Venda não encontrada");
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
}
