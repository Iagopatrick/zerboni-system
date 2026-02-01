import { FastifyInstance } from "fastify";
import { UserService } from "./user.service";

export async function userRoutes(app: FastifyInstance) {
  const service = new UserService();

  app.get("/", async (request, reply) => {
    try {
      const { search = "", page = "1", limit = "10" } = request.query as any;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      const result = await service.listUsers({ search, page: pageNum, limit: limitNum });
      return result;
    } catch (err: any) {
      reply.code(500);
      return { message: err.message, status: "error" };
    }
  });

  app.post("/", async (request, reply) => {
    const { name, email } = request.body as {
      name: string;
      email: string;
    };

    try {
      const user = await service.createUser({ name, email });
      reply.code(201);
      return user;
    } catch (err: any) {
      reply.code(400);
      return { message: err.message };
    }
  });

  app.put("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as { name?: string; email?: string };

    try {
      const updatedUser = await service.updateUser(id, data);
      return updatedUser;
    } catch (err: any) {
      reply.code(400);
      return { message: err.message };
    }
  });

  // Deletar usuário
  app.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await service.deleteUser(id);
      reply.code(204);
      return {};
    } catch (err: any) {
      reply.code(400);
      return { message: err.message };
    }
  });
}
