import type { Request, Response } from "express";
import areaService from "../services/areaService.js";


class AreasController {
  async getAll(req: Request, res: Response) {
    try {
      const response = await areaService.getAll()
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message, data: {} });
    }
  }
}

export default new AreasController();
