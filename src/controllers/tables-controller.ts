import { AppError } from "@/utils/app-error";
import { knex } from "../database/knex";
import { Request, Response, NextFunction } from "express";
export class TablesController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const tables = await knex<TableRepository>("tables")
        .select()
        .orderBy("table_number");
      if (tables.length === 0) {
        throw new AppError("Nenhuma mesa encontrada", 404);
      }
      res.status(200).json(tables);
    } catch (error) {
      next(error);
    }
  }
}
