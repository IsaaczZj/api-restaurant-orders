import { Router } from "express";
import { OrdersController } from "@/controllers/orders-controller";

const ordersController = new OrdersController();
const ordersRoutes = Router();

ordersRoutes.get("/table-session/:table_session_id", ordersController.index);
ordersRoutes.post("/", ordersController.create);
export { ordersRoutes };
