import { knex } from "@/database/knex";
import { AppError } from "@/utils/app-error";
import { Request, Response, NextFunction } from "express";
import z from "zod";
class OrdersController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_session_id: z.number(),
        product_id: z.number(),
        quantity: z.number(),
      });
      const { table_session_id, product_id, quantity } = bodySchema.parse(
        req.body
      );

      const tableSession = await knex<TablesSessionsRepository>(
        "tables_sessions"
      )
        .where({ id: table_session_id })
        .first();

      if (!tableSession) {
        throw new AppError("Sessão não encontrada", 404);
      }
      if (tableSession.closed_at) {
        throw new AppError("Sessão já encerrada", 404);
      }

      const product = await knex<ProductRepository>("products").where({ id: product_id }).first();
      if (!product) {
        throw new AppError("Produto não encontrado", 404);
      }

      return res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
}

export { OrdersController };
