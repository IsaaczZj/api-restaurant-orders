import { knex } from "@/database/knex";
import { AppError } from "@/utils/app-error";
import { Request, Response, NextFunction } from "express";
import z from "zod";

class TablesSessionsController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await knex<TablesSessionsRepository>(
        "tables_sessions"
      ).orderBy("opened_at", "desc");
      return res.status(200).json(sessions);
    } catch (error) {
      next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_id: z.coerce.number("O ID da mesa deve ser numérico"),
      });
      const { table_id } = bodySchema.parse(req.body);
      const table = await knex<TablesSessionsRepository>("tables")
        .where({ id: table_id })
        .first();
      if (!table) {
        throw new AppError("Mesa não encontrada", 404);
      }

      const openSession = await knex<TablesSessionsRepository>(
        "tables_sessions"
      )
        .where({ table_id })
        .whereNull("closed_at") // ✅ Só sessões abertas
        .first();
      if (openSession) {
        throw new AppError("Mesa já possui uma sessao aberta", 400);
      }
      await knex<TablesSessionsRepository>("tables_sessions").insert({
        table_id,
        opened_at: knex.fn.now(),
      });
      return res.status(201).json({
        message: "Sessão criada com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z.coerce
        .number("O ID precisa ser um número")
        .parse(req.params.id);

      const session = await knex<TablesSessionsRepository>("tables_sessions")
        .where({ id })
        .whereNull("closed_at")
        .first();
      if (!session) {
        throw new AppError("Essa sessão não existe ou já foi fechada", 404);
      }
      await knex<TablesSessionsRepository>("tables_sessions")
        .where({ id })
        .update({ closed_at: knex.fn.now() });

      return res.status(200).json({ message: "Mesa encerrada com sucesso" });
    } catch (error) {
      next(error);
    }
  }
}
export { TablesSessionsController };
