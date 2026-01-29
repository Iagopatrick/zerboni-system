import Fastify from "fastify";
import { userRoutes } from "./modules/user/user.controller";

export const app = Fastify();

app.register(userRoutes, { prefix: "/api/users" });
