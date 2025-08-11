import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/app-error";
import { ZodError } from "zod";

export function errorHandling(
  error: any,
  req: Request,
  res: Response,
  _: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  if (error instanceof ZodError) {
    const issues = error.issues.map((e) => ({
      code: e.code,
      message: e.message,
    }));
    return res.status(400).json({
      message: "Erro de validação",
      issues,
    });
  }

  return res.status(500).json({ message: error.message });
}
