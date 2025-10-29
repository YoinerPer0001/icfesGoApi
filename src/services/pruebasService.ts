import { ApiResponse } from "../core/responseSchedule.js";
import type Pruebas from "../models/pruebasModel.js";
import pruebasRepository from "../repository/pruebasRepository.js";

class PruebasService {
  /**
   * Get all tests
   */
  async getAll(): Promise<ApiResponse<Pruebas[] | null>> {
    try {
      const result = await pruebasRepository.findAll();
      return new ApiResponse(200, "success", result);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Get test by ID
   */
  async getById(id: string): Promise<ApiResponse<Pruebas | null>> {
    try {
      const prueba = await pruebasRepository.findById(id);
      if (!prueba) return new ApiResponse(404, "Test not found", null);
      return new ApiResponse(200, "success", prueba);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Get test by name
   */
  async getByName(name: string): Promise<ApiResponse<Pruebas | null>> {
    try {
      const prueba = await pruebasRepository.findByName(name);
      if (!prueba) return new ApiResponse(404, "Test not found", null);
      return new ApiResponse(200, "success", prueba);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Create a new test
   */
  async create(data: Partial<Pruebas>): Promise<ApiResponse<Pruebas | null>> {
    try {
      const prueba = await pruebasRepository.createPrueba(data as any);
      return new ApiResponse(201, "Test created successfully", prueba);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Update a test
   */
  async update(
    id: string,
    data: Partial<Pruebas>
  ): Promise<ApiResponse<null>> {
    try {
      const [affected] = await pruebasRepository.updatePrueba(id, data);
      if (affected === 0)
        return new ApiResponse(404, "Test not found or not updated", null);
      return new ApiResponse(200, "Test updated successfully", null);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Delete a test
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const deleted = await pruebasRepository.deletePrueba(id);
      if (!deleted) return new ApiResponse(404, "Test not found", null);
      return new ApiResponse(200, "Test deleted successfully", null);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }
}

export default new PruebasService();
