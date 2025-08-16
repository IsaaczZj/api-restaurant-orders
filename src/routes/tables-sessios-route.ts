import { TablesSessionsController } from "@/controllers/tables-sessios-controller";
import { Router } from "express";

const tablesSessionsController = new TablesSessionsController();

const tablesSessionsRoutes = Router();

tablesSessionsRoutes.post("/", tablesSessionsController.create);

export {tablesSessionsRoutes}