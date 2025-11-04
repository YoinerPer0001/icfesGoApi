import { ApiResponse } from "../core/responseSchedule.js";
import type User from "../models/userModel.js";
import userRepository from "../repository/userRepository.js";

interface ResponseTutor {
  data: User[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface FiltersTutors {
  cityId?: string | undefined;
      areaIds?: string[];
      orderBy?: "precio" | "promedio";
      orderDir?: "ASC" | "DESC";
      name?: string;
      minPrice?: number;
      maxPrice?: number;
}

class UserService {
  async getAllTutors(
    page: number,
    limit: number,
    filters?: FiltersTutors
  ): Promise<ApiResponse<ResponseTutor | null>> {
    try {
      const response = await userRepository.getTutors(page, limit, filters);
      return new ApiResponse(200, "success", response);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }
}

export default new UserService();
