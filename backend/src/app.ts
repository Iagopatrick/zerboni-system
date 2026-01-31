import Fastify from "fastify";
import cors from "@fastify/cors";
import { userRoutes } from "./modules/user/user.controller";
import { customerRoutes } from "./modules/customer/customer.controller";
import { supplierRoutes } from "./modules/supplier/supplier.controller";
import { supplierPaymentRoutes } from "./modules/supplier-payment/supplier-payment.controller";

export const app = Fastify();

app.register(cors, { origin: true,   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

app.register(userRoutes, { prefix: "/api/users" });
app.register(customerRoutes, { prefix: "/api/customers" });
app.register(supplierRoutes, { prefix: "/api/suppliers" });
app.register(supplierPaymentRoutes, { prefix: "/api/suppliers-payments" });