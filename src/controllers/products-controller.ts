import { NextFunction, Request, Response } from "express";
import { knex } from "../database/knex";
import z from "zod";
import { AppError } from "@/utils/app-error";

class ProductController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.query;
      const products = await knex<ProductRepository>("products")
        .select()
        .whereLike("name", `%${name ?? ""}%`)
        .orderBy("name");
      if (products.length === 0) {
        throw new AppError("Nenhum produto cadastrado", 404);
      }
      return res.json({ products });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z
          .string({ error: "O nome do produto é obrigatório" })
          .trim()
          .min(6, "O produto precisa ter no mínimo 6 caracteres"),
        price: z.number().gt(0, "O preço precisa ser maior do que zero"),
      });
      const { name, price } = bodySchema.parse(req.body);

      await knex<ProductRepository>("products").insert({ name, price });

      return res.status(201).json({ name, price });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), {
          error: "O id deve ser um número",
        })
        .parse(req.params.id);
      const bodySchemaUpdate = z.object({
        name: z
          .string({ error: "O nome do produto é obrigatório" })
          .trim()
          .min(6, "O produto precisa ter no mínimo 6 caracteres")
          .optional(),
        price: z
          .number()
          .gt(0, "O preço precisa ser maior do que zero")
          .optional(),
      });
      const { name, price } = bodySchemaUpdate.parse(req.body);
      if (!name && !price) {
        throw new AppError("Digite algo para atualizar o produto", 400);
      }
      await knex<ProductRepository>("products")
        .update({ name, price, updated_at: knex.fn.now() })
        .where({id});
      return res.json({ message: "Produto atualizado com sucesso" });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductController };
