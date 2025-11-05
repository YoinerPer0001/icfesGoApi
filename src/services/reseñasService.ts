import { ApiResponse } from "../core/responseSchedule.js";
import type ReseñasTutor from "../models/reseñasTutorModel.js";
import reseñasTutorRepository from "../repository/reseñasTutorRepository.js";
import type { CreationAttributes, Transaction } from "sequelize";
import userRepository from "../repository/userRepository.js";

class ReseñasTutorService {
  /**
   * Crea o actualiza una reseña de tutor según (tutor_id, student_id)
   */
  async createOrUpdate(
    studentId: string,
    data: CreationAttributes<ReseñasTutor>
  ): Promise<ApiResponse<ReseñasTutor | null>> {
    try {
      const user = await userRepository.findByFirebaseId(studentId);
      if (!user) {
        return new ApiResponse(403, "not Authorized", null);
      }
      const student_id = user?.dataValues.id;
      data.student_id = student_id;
      const review = await reseñasTutorRepository.updateOrCreate(data);
      return new ApiResponse(201, "success", review[0]);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }
}

export default new ReseñasTutorService();
