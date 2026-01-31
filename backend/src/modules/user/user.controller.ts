import { FastifyInstance } from "fastify";
import { UserService } from "./user.service";

export async function userRoutes(app: FastifyInstance) {
  const service = new UserService();

  app.get("/", async (request, reply) => {
    try {
      return await service.listUsers();
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
}
