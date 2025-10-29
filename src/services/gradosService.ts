import { ApiResponse } from "../core/responseSchedule.js";
import type Grados from "../models/gradosModel.js";
import gradosRepository from "../repository/gradosRepository.js";

class GradosService {
  /**
   * Get all grades
   */
  async getAll(): Promise<ApiResponse<Grados[] | null>> {
    try {
      const result = await gradosRepository.findAll();
      return new ApiResponse(200, "success", result);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Get grade by ID
   */
  async getById(id: string): Promise<ApiResponse<Grados | null>> {
    try {
      const grado = await gradosRepository.findById(id);
      if (!grado) return new ApiResponse(404, "Grade not found", null);
      return new ApiResponse(200, "success", grado);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Get grade by name
   */
  async getByName(name: string): Promise<ApiResponse<Grados | null>> {
    try {
      const grado = await gradosRepository.findByName(name);
      if (!grado) return new ApiResponse(404, "Grade not found", null);
      return new ApiResponse(200, "success", grado);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Create a new grade
   */
  async create(data: Partial<Grados>): Promise<ApiResponse<Grados | null>> {
    try {
      const grado = await gradosRepository.createGrado(data as any);
      return new ApiResponse(201, "Grade created successfully", grado);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Update a grade
   */
  async update(
    id: string,
    data: Partial<Grados>
  ): Promise<ApiResponse<null>> {
    try {
      const [affected] = await gradosRepository.updateGrado(id, data);
      if (affected === 0)
        return new ApiResponse(404, "Grade not found or not updated", null);
      return new ApiResponse(200, "Grade updated successfully", null);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Delete a grade
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const deleted = await gradosRepository.deleteGrado(id);
      if (!deleted) return new ApiResponse(404, "Grade not found", null);
      return new ApiResponse(200, "Grade deleted successfully", null);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }
}

export default new GradosService();
