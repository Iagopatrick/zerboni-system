import { SaleRepository } from "./sale.repository";
import { CustomerService } from "../customer/customer.service";

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
    paymentType: number; // Alterado para number conforme <<enumeration>> tipoPagamento
    saleType: number; // Adicionado conforme <<enumeration>> tipoVenda
    sellerId: string;
  }) {
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
    if (data.paymentType === 1 || data.paymentType === 5) {
      totalValue *= 0.9; // 10% de desconto
    }

    // Registro no Banco de Dados
    // O status 1 representa 'FECHADO' conforme o diagrama de classes
    const sale = await this.repository.registerSale({
      ...data,
      totalValue,
      status: 1,
    });

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
