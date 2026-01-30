import Fastify from "fastify";
import { userRoutes } from "./modules/user/user.controller";
import { customerRoutes } from "./modules/customer/customer.controller";


export const app = Fastify();

app.register(userRoutes, { prefix: "/api/users" });
app.register(customerRoutes, { prefix: "/api/customers" });