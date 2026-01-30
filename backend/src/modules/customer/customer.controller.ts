import { FastifyInstance } from "fastify";
import { CustomerService } from "./customer.service";

export async function customerRoutes(app: FastifyInstance) {
    const service = new CustomerService();

    app.get("/", async () => {
        return service.listCustomers();
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
}
