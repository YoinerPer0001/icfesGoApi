import type { Response, Request } from "express";
import userRepository from "../repository/userRepository.js";
import { ApiResponse } from "../core/responseSchedule.js";
import userService, { type FiltersTutors } from "../services/userService.js";

class UserController {
  async getAllTutors(req: Request, res: Response) {
    try {
      const {
        page = "1",
        limit = "10",
        cityId,
        areaIds,
        orderBy,
        orderDir,
        name,
        minPrice,
        maxPrice,
      } = req.query;

      const filters: FiltersTutors = {
        cityId: cityId as string | undefined,
        orderBy: (orderBy as "precio" | "promedio") || undefined,
        orderDir: (orderDir as "ASC" | "DESC") || undefined,
        areaIds: typeof areaIds === "string" ? areaIds.split(",") : [],
        name: (name as string),
        minPrice : parseInt(minPrice as string),
        maxPrice: parseInt(maxPrice as string),
      };

  
      console.log(req.query)

      const response = await userService.getAllTutors(
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        filters
      );
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: error, data: {} });
    }
  }
}

export default new UserController();
