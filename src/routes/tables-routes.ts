import { TablesController } from "@/controllers/tables-controller";
import { Router } from "express";

const tablesRoutes = Router();
const tablesController = new TablesController();

tablesRoutes.get("/", tablesController.index);
tablesRoutes.post("/create-table", tablesController.create);

export { tablesRoutes };
