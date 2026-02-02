import { FastifyInstance } from "fastify";
import { CustomerService } from "./customer.service";

export async function customerRoutes(app: FastifyInstance) {
    const service = new CustomerService();

    app.get("/", async (request, reply) => {
        try {
            const { search = "", page = "1", limit = "10" } = request.query as any;
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            const result = await service.listCustomers({
                search,
                page: pageNum,
                limit: limitNum,
            });
            return result;
        } catch (err: any) {
            reply.code(500);
            return {
                message: err.message,
                status: "error",
            };
        }
    });

    app.post("/", async (request, reply) => {
        const { name, cpf, cep, street, neighborhood, state, streetNumber, phoneNumber, email } = request.body as {
            name: string;
            cpf: string;
            cep: string;
            street: string;
            neighborhood: string;
            state: string;
            streetNumber: number;
            phoneNumber: string;
            email: string;

        };

        try {
            const customer = await service.createCustomer({ name, cpf, cep, street, neighborhood, state, streetNumber, phoneNumber, email });
            reply.code(201);
            return customer;
        } catch (err: any) {
            reply.code(400);
            return { message: err.message };
        }
    });

    app.put("/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const data = request.body as any;

        try {
            const updatedCustomer = await service.updateCustomer(Number(id), data);
            return updatedCustomer;
        } catch (err: any) {
            reply.code(400);
            return { message: err.message };
        }
    });

    app.delete("/:id", async (request, reply) => {
        const { id } = request.params as { id: string };

        try {
            await service.deleteCustomer(id);

            // Status 204 significa "No Content" (Sucesso, mas não há nada para retornar no corpo)
            return reply.code(204).send();
        } catch (err: any) {
            reply.code(400);
            return { message: err.message };
        }
    });
}
