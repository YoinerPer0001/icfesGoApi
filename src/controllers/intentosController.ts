import type { Request, Response } from "express";
import intentosService from "../services/intentosService.js";

class IntentosController {
  async create(req: Request, res: Response) {
    try {
      const uid = (req as any).uid;
      const data = req.body;
      const response = await intentosService.create(uid, data);
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: error, data: null });
    }
  }

  async getRanking(req: Request, res: Response) {
    try {
    const uid = (req as any).uid;
      const response = await intentosService.getRanking(uid);
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: error, data: null });
    }
  }
}

export default new IntentosController();
