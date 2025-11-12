import type { Request, Response } from "express";
import certificatesService from "../services/certificatesService.js";

class CertificatesController {

  // Crear un nuevo certificado
  async create(req: Request, res: Response) {
    try {
      const uid = (req as any).uid;
      console.log(req.body)
      const response = await certificatesService.create(uid, req.body);
      console.log(response)
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message, data: {} });
    }
  }

  // Eliminar un certificado por ID
  async delete(req: Request, res: Response) {
    try {
      const { id, file } = req.query as { id: string , file:string};
      const uid = (req as any).uid;
      console.log(id)
      console.log(uid)
      console.log(file)
      const response = await certificatesService.delete(uid, id, file);
      console.log(response)
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message, data: {} });
    }
  }
}

export default new CertificatesController();
