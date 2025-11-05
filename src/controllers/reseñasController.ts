import type { Request, Response } from "express";
import reseñasService from "../services/reseñasService.js";

class ReseñasTutorController {
  /**
   * Crear o actualizar una reseña de tutor
   */
  async createOrUpdate(req: Request, res: Response) {
    try {
      const estudentId = (req as any).uid;
      const data = req.body; // tutor_id, rating, text
      console.log(data)

      const response = await reseñasService.createOrUpdate(estudentId, data);

      console.log(response)

      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({
        message: (error as Error).message,
        data: {},
      });
    }
  }
}

export default new ReseñasTutorController();
