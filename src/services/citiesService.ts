import { ApiResponse } from "../core/responseSchedule.js";
import type Cities from "../models/citiesModel.js";
import citiesRepository from "../repository/citiesRepository.js";

class CitiesService {
  /**
   * Get all cities
   */
  async getAll(): Promise<ApiResponse<Cities[] | null>> {
    try {
      const result = await citiesRepository.findAll();
      return new ApiResponse(200, "success", result);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Find a city by ID
   */
  async getById(id: string): Promise<ApiResponse<Cities | null>> {
    try {
      const city = await citiesRepository.findById(id);
      if (!city) return new ApiResponse(404, "City not found", null);
      return new ApiResponse(200, "success", city);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Find a city by name
   */
  async getByName(name: string): Promise<ApiResponse<Cities | null>> {
    try {
      const city = await citiesRepository.findByName(name);
      if (!city) return new ApiResponse(404, "City not found", null);
      return new ApiResponse(200, "success", city);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Create a new city
   */
  async create(data: Partial<Cities>): Promise<ApiResponse<Cities | null>> {
    try {
      const city = await citiesRepository.createCity(data as any);
      return new ApiResponse(201, "City created successfully", city);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Update a city
   */
  async update(
    id: string,
    data: Partial<Cities>
  ): Promise<ApiResponse<null>> {
    try {
      const [affected] = await citiesRepository.updateCity(id, data);
      if (affected === 0)
        return new ApiResponse(404, "City not found or not updated", null);
      return new ApiResponse(200, "City updated successfully", null);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Delete a city
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const deleted = await citiesRepository.deleteCity(id);
      if (!deleted) return new ApiResponse(404, "City not found", null);
      return new ApiResponse(200, "City deleted successfully", null);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }
}

export default new CitiesService();
