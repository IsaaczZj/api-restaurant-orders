import { knex } from "@/database/knex";
import { AppError } from "@/utils/app-error";
import { Request, Response, NextFunction } from "express";
import z from "zod";

class TablesSessionsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_id: z.coerce.number("O ID da mesa deve ser numérico"),
      });
      const { table_id } = bodySchema.parse(req.body);
      const table = await knex("tables").where({ id: table_id }).first();
      if (!table) {
        throw new AppError("Mesa não encontrada", 404);
      }

      const openSession = await knex("tables_sessions")
        .where({ table_id })
        .whereNull("closed_at")
        .first();
      if (openSession) {
        throw new AppError("Mesa já possui uma sessao aberta", 400);
      }
      await knex<TablesSessionsRepository>("tables_sessions").insert({
        table_id,
        opened_at: knex.fn.now(),
      });
      res.status(201).json({
        message: "Sessão criada com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }
}
export { TablesSessionsController };
