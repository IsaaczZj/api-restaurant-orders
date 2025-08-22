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

      const product = await knex<ProductRepository>("products")
        .where({ id: product_id })
        .first();
      if (!product) {
        throw new AppError("Produto não encontrado", 404);
      }

      await knex<OrderRespository>("orders").insert({
        product_id,
        table_session_id,
        quantity,
        price: product.price,
      });

      return res.status(201).json({ message: "Pedido criado com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { table_session_id } = req.params;

      const order = await knex("orders")
        .select(
          "orders.id",
          "orders.table_session_id",
          "orders.product_id",
          "products.name",
          "orders.price",
          "orders.quantity",
          knex.raw("(orders.price * orders.quantity) as total"),
          "orders.created_at",
          "orders.updated_at"
        )
        .join("products", "products.id", "orders.product_id")
        .where({
          table_session_id,
        })
        .orderBy("orders.created_at", "desc");

      if (order.length === 0) {
        throw new AppError("Mesa não encontrada ou sessão já fechada", 404);
      }
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }

  async showResume(req: Request, res: Response, next: NextFunction) {
    try {
      const { table_session_id } = req.params;

      const orders = await knex("orders")
        .select(knex.raw("coalesce(sum(orders.price * orders.quantity), 0) as total_check"))

        .where({
          table_session_id,
        })
        .first();

      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }
}

export { OrdersController };
