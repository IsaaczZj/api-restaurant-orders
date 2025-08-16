import { Request, Response, NextFunction } from "express";

class TablesSessionsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      return res.json({ message: "Criado" });
    } catch (error) {
      next(error);
    }
  }
}
export {TablesSessionsController}