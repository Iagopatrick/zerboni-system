import { PaymentMethod } from "./supplier.repository";
import { FastifyInstance } from "fastify";
import { SupplierService, } from "./supplier.service";

export async function supplierRoutes(app: FastifyInstance) {
    const service = new SupplierService();

    app.get("/", async (request, reply) => {
        try {
            const filters = request.query as any;
            const suppliers = await service.listSuppliers(filters);
            return suppliers;
        } catch (err: any) {
            reply.code(500);
            return { message: "Erro ao listar fornecedores", error: err.message };
        }
    });

    app.post("/", async (request, reply) => {
        type CreateSupplierBody = {
            legalName: string;
            active: boolean;
            cep: string;
            street: string;
            streetNumber: number;
            neighborhood: string;
            city: string;
            state: string;
            phoneNumber: string;
            fax?: string;
            cnpj: string;
            producerTaxId?: string;
            municipalTaxId?: string;
            stateTaxId?: string;
            website?: string;
            email: string;
            invoceEmail?: string;
            cashAccount: string;
            taxRegime: 'Simples Nacional' | 'Lucro Presumido' | 'Lucro Real';
            paymentMethods: PaymentMethod[];
            notes?: string;
        };

        const data = request.body as CreateSupplierBody;

        try {
            // Passamos o objeto 'data' completo para o service
            const supplier = await service.createSupplier(data);

            reply.code(201);
            return supplier;
        } catch (err: any) {
            reply.code(400);
            return { message: "Erro ao criar fornecedor", erro: err.message };
        }
    });

    app.put("/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const data = request.body as any;

        try {
            const updatedSupplier = await service.updateSupplier(Number(id), data);
            return updatedSupplier;
        } catch (err: any) {
            reply.code(400);
            return { message: err.message };
        }
    });

    app.delete("/:id", async (request, reply) => {
        const { id } = request.params as { id: string };

        try {
            await service.deleteSupplier(id);

            return reply.code(204).send();
        } catch (err: any) {
            reply.code(400);
            return { message: err.message };
        }
    });
}