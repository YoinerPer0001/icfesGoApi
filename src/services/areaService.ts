import { ApiResponse } from "../core/responseSchedule.js";
import type Areas from "../models/areasModel.js";
import areasRepository from "../repository/areasRepository.js";

class AreasService {
  /**
   * Get all areas
   */
  async getAll(): Promise<ApiResponse<Areas[] | null>> {
    try {
      const result = await areasRepository.findAll();
      return new ApiResponse(200, "success", result);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Get an area by ID
   */
  async getById(id: string): Promise<ApiResponse<Areas | null>> {
    try {
      const area = await areasRepository.findById(id);
      if (!area) return new ApiResponse(404, "Area not found", null);
      return new ApiResponse(200, "success", area);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Create a new area
   */
  async create(data: Partial<Areas>): Promise<ApiResponse<Areas | null>> {
    try {
      const area = await areasRepository.createArea(data as any);
      return new ApiResponse(201, "Area created successfully", area);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Update an existing area
   */
  async update(
    id: string,
    data: Partial<Areas>
  ): Promise<ApiResponse<number | null>> {
    try {
      const [updated] = await areasRepository.updateArea(id, data);
      if (updated === 0)
        return new ApiResponse(404, "Area not found or not updated", null);
      return new ApiResponse(200, "Area updated successfully", updated);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Delete an area
   */
  async delete(id: string): Promise<ApiResponse<number | null>> {
    try {
      const deleted = await areasRepository.deleteArea(id);
      if (deleted === 0)
        return new ApiResponse(404, "Area not found or not deleted", null);
      return new ApiResponse(200, "Area deleted successfully", deleted);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }
}

export default new AreasService();
