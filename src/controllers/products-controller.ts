import { NextFunction, Request, Response } from "express";
import { knex } from "../database/knex";
import z from "zod";
import { AppError } from "@/utils/app-error";

class ProductController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await knex("products").select();
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
}

export { ProductController };
