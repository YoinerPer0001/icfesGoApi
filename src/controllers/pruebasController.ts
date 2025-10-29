import type { Request, Response } from "express";
import pruebasService from "../services/pruebasService.js";

class PruebasController {
  async getAll(req: Request, res: Response) {
    try {
      const response = await pruebasService.getAll();
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message, data: {} });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await pruebasService.getById(id!!);
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message, data: {} });
    }
  }

  async getByName(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const response = await pruebasService.getByName(name!!);
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message, data: {} });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const response = await pruebasService.create(req.body);
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message, data: {} });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await pruebasService.update(id!!, req.body);
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message, data: {} });
    }
  }
}

export default new PruebasController();
