import type { Request, Response } from "express";
import simulacrosService from "../services/simulacrosService.js";

class SimulacrosController {
  async create(req: Request, res: Response) {
    try {
      const uid = (req as any).uid as string;
      const data = req.body;
      console.log(uid);
      console.log(data);
      const response = await simulacrosService.create(uid, data);
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: error, data: null });
    }
  }

  async getByCreator(req: Request, res: Response) {
    try {
      const uid = (req as any).uid as string;
      const page: number = Number(req.query.page ?? 1);
      const limit: number = Number(req.query.limit ?? 1);
      const area = req.query.area as string;

      const response = await simulacrosService.getByCreator(
        uid,
        page,
        limit,
        area
      );
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: error, data: null });
    }
  }

  async getPublic(req: Request, res: Response) {
    try {
      const page: number = Number(req.query.page ?? 1);
      const limit: number = Number(req.query.limit ?? 1);
      const area = req.query.area as string;

      const response = await simulacrosService.getPublic(
        page,
        limit,
        area
      );
    
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: error, data: null });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const uid = (req as any).uid as string;
      const id = req.query.id as string;

      const response = await simulacrosService.delete(uid, id )
      console.log(response)
      res.status(response.code).json(response);

    } catch (error) {
      res.status(500).json({ message: error, data: null });
    }
  }
}

export default new SimulacrosController();
