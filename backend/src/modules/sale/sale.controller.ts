import { FastifyInstance } from "fastify";
import { SaleService } from "./sale.service";

export async function saleRoutes(app: FastifyInstance) {
  const service = new SaleService();

  // UC05 - Registrar Venda (Fluxo Normal)
  app.post("/", async (request, reply) => {
    try {
      const data = request.body as {
        cpf: string;
        items: Array<{
          productId: string;
          quantity: number;
          unitPrice: number;
        }>;
        // Alinhado ao Diagrama: Enviar o ID do Enum (1: Dinheiro, 5: Pix, etc)
        paymentType: number;
        saleType: number; // 1: Normal, 2: Interesse, 3: Condicional
        sellerId: string;
      };

      const sale = await service.createSale(data);
      return reply.status(201).send(sale);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  app.get("/", async (request, reply) => {
    try {
      const sales = await service.listAllSales();
      return sales;
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const sale = await service.getSaleById(Number(id));
      return sale;
    } catch (error) {
      return reply.status(404).send({ error: (error as Error).message });
    }
  });

  // UC05 - Finalização de venda com interesse (Filtro: Telefone)
  app.get("/interests", async (request, reply) => {
    // Corrigido: O UC05 pede filtro por número de telefone para interesses
    const { phone } = request.query as { phone?: string };

    try {
      const interests = await service.listInterests(phone);
      return interests;
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  // UC05 - Finalização de venda em condicional (Filtro: CPF ou Nome)
  app.get("/conditional", async (request, reply) => {
    const { cpf } = request.query as { cpf?: string };
    try {
      const conditionals = await service.listConditionals(cpf);
      return conditionals;
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });
}
