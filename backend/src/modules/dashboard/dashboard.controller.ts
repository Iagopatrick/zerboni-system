
import { FastifyInstance } from "fastify";
import { DashboardService } from "./dashboard.service";

export async function dashboardRoutes(app: FastifyInstance) {
    const service = new DashboardService();

    app.get("/", async (request, reply) => {
        try {
            const filters = request.query as any;
            const products = await service.getDashboardData();
            return products;
        } catch (err: any) {
            reply.code(500);
            return { message: "Erro ao buscar dados do dashboard", error: err.message };
        }


    });

}
