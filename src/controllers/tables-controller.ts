import { AppError } from "@/utils/app-error";
import { knex } from "../database/knex";
import { Request, Response, NextFunction } from "express";
import z from "zod";
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
  async create(req: Request, res: Response, next: NextFunction) {
    const { table_number } = z
      .object({
        table_number: z.coerce.number().nonoptional(),
      })
      .parse(req.body);
    const tableExist = await knex<TableRepository>("tables").where({
      table_number,
    });

    if (tableExist.length > 0) {
      throw new AppError("A mesa com esse número já existe", 400);
    }
    await knex<TableRepository>("tables").insert({ table_number });
    return res.status(200).json({ message: "Mesa criada com sucesso" });
  }
}
