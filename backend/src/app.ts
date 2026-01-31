import Fastify from "fastify";
import cors from "@fastify/cors";
import { userRoutes } from "./modules/user/user.controller";
import { customerRoutes } from "./modules/customer/customer.controller";


export const app = Fastify();

app.register(cors, { origin: true,   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

app.register(userRoutes, { prefix: "/api/users" });
app.register(customerRoutes, { prefix: "/api/customers" });