import { FastifyInstance } from "fastify";
import { FiscalReportService } from "./fiscal-report.service";

export async function fiscalReportRoutes(app: FastifyInstance) {
  const service = new FiscalReportService();

  // GET /fiscal-report - Lista registros aplicando RN01 e filtros
  app.get("/", async (request, reply) => {
    const userType = request.headers["user_type"];

    const filters = request.query;

    try {
      const records = await service.listRecords(Number(userType), filters);
      return records;
    } catch (error) {
      return reply.status(403).send({ error: (error as Error).message });
    }
  });

  // POST /fiscal-report/generate - Passo 7 a 12
  app.post("/generate", async (request, reply) => {
    const { records, format, fileName } = request.body as any;

    try {
      // Agora o Service receberá o array 'records' do JSON acima
      const report = await service.generateFile(records, format, fileName);
      return reply.status(201).send(report);
    } catch (error) {
      // Isso transforma o 500 em um 400 (Bad Request) mais elegante
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  app.post("/send-email", async (request, reply) => {
    const { email, filePath } = request.body as any;

    try {
      const result = await service.sendReportByEmail(email, filePath);
      return reply.send(result);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });
}
