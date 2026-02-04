import { ProductService } from './product.service';
import { FastifyInstance } from "fastify";

export async function productRoutes(app: FastifyInstance) {
    const service = new ProductService();

    app.get("/", async (request, reply) => {
        try {
            const { search = "", page = "1", limit = "10" } = request.query as any;
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            const result = await service.listProducts({
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
        const { registrationId, branch, productGroup, brand, description, reference, price, stock, productType, unitOfMeasure, images, tradeName, active, size, supplierCnpj } = request.body as {
            registrationId: string;
            branch: string;
            productGroup: string;
            brand: string;
            description: string;
            reference: string;
            price: string;
            stock: number;
            productType: string;
            unitOfMeasure: number;
            images: string[];
            tradeName: string;
            active: boolean;
            size: string;
            supplierCnpj: string;
        };

        try {
            const product = await service.createProduct(request.body as any);
            reply.code(201);
            return product;
        } catch (err: any) {
            reply.code(400);
            return { message: err.message };
        }
    });

    app.put("/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const data = request.body as any;

        try {
            const updatedProduct = await service.updateProduct(Number(id), data);
            return updatedProduct;
        } catch (err: any) {
            reply.code(400);
            return { message: err.message };
        }
    });

    app.delete("/:id", async (request, reply) => {
        const { id } = request.params as { id: string };

        try {
            await service.deleteProduct(id);
            return reply.code(204).send();
        } catch (err: any) {
            reply.code(400);
            return { message: err.message };
        }
    });
}
