import { Router } from "express";
import { OrdersController } from "@/controllers/orders-controller";

const ordersController = new OrdersController();
const ordersRoutes = Router();

ordersRoutes.post("/", ordersController.create);
export { ordersRoutes };
