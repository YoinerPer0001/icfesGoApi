import { ApiResponse } from "../core/responseSchedule.js";
import StudentInfo from "../models/StudentInfoModel.js";

import studentInfoRepository from "../repository/studentInfoRepository.js";

class StudentInfoService {
  /**
   * Get all student info records
   */
  async getAll(): Promise<ApiResponse<StudentInfo[] | null>> {
    try {
      const result = await studentInfoRepository.findAll();
      return new ApiResponse(200, "success", result);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Get student info by ID
   */
  async getById(id: string): Promise<ApiResponse<StudentInfo | null>> {
    try {
      const record = await studentInfoRepository.findById(id);
      if (!record) return new ApiResponse(404, "Student info not found", null);
      return new ApiResponse(200, "success", record);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Get student info by user ID
   */
  async getByUserId(userId: string): Promise<ApiResponse<StudentInfo | null>> {
    try {
      const record = await studentInfoRepository.findByUserId(userId);
      if (!record) return new ApiResponse(404, "Student info not found", null);
      return new ApiResponse(200, "success", record);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Create a new student info record
   */
  async create(
    data: Partial<StudentInfo>
  ): Promise<ApiResponse<StudentInfo | null>> {
    try {
      const record = await studentInfoRepository.createStudentInfo(data as any);
      return new ApiResponse(201, "Student info created successfully", record);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Update an existing student info record
   */
  async update(
    id: string,
    data: Partial<StudentInfo>
  ): Promise<ApiResponse<number | null>> {
    try {
      const [updated] = await studentInfoRepository.updateStudentInfo(id, data);
      if (updated === 0)
        return new ApiResponse(404, "Student info not found or not updated", null);
      return new ApiResponse(200, "Student info updated successfully", updated);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Delete student info by ID
   */
  async delete(id: string): Promise<ApiResponse<number | null>> {
    try {
      const deleted = await studentInfoRepository.deleteStudentInfo(id);
      if (deleted === 0)
        return new ApiResponse(404, "Student info not found or not deleted", null);
      return new ApiResponse(200, "Student info deleted successfully", deleted);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }
}

export default new StudentInfoService();
