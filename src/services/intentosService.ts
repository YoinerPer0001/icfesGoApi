import type { CreationAttributes } from "sequelize";
import { ApiResponse } from "../core/responseSchedule.js";
import type Intentos from "../models/intentosModel.js";
import intentosRepository from "../repository/intentosRepository.js";
import type UserAnswers from "../models/user_answersModel.js";
import userRepository from "../repository/userRepository.js";
import { db } from "../core/db.js";
import user_answerRepository from "../repository/user_answerRepository.js";

export interface IntentosDto {
  intento: Partial<CreationAttributes<Intentos>>;
  answers: Partial<CreationAttributes<UserAnswers>>[];
}

class IntentosService {
  /**
   * Get all intentos
   */
  async getAll(): Promise<ApiResponse<Intentos[] | null>> {
    try {
      const result = await intentosRepository.findAll();
      return new ApiResponse(200, "success", result);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  async getRanking(userId:string):
  Promise<ApiResponse<{position: number | null; bestScore: number; ranking: Intentos[]} | null>> 
  {
    try {
      const user = await userRepository.findByFirebaseId(userId)
      if(!user){
        return new ApiResponse(401, "", null);
      }
      const result = await intentosRepository.getRankingGlobal(user?.dataValues.id);
      return new ApiResponse(200, "success", result);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }
  /**
   * Get intento by ID
   */
  async getById(id: string): Promise<ApiResponse<Intentos | null>> {
    try {
      const intento = await intentosRepository.findById(id);
      if (!intento) return new ApiResponse(404, "Intento not found", null);
      return new ApiResponse(200, "success", intento);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Create a new intento
   */
  async create(
    uid: string,
    data: IntentosDto
  ): Promise<ApiResponse<Intentos | null>> {
    const transaction = await db.transaction();
    try {
      const user = await userRepository.findByFirebaseId(uid);
      if (!user) {
        return new ApiResponse(404, "Not authorized", null);
      }

      data.intento.id_user = user.dataValues.id;
      const intento = await intentosRepository.createIntento(data.intento, {
        transaction,
      });

      if (!intento) {
        transaction.rollback();
        return new ApiResponse(404, "Error to create attempt", null);
      }

      //create userAnswer
      const intentoId = intento.dataValues.id
      for (const answer of data.answers) {
        answer.intento_id = intentoId
        console.log(answer)
        const registerAnswer = await user_answerRepository.createUserAnswer(
          answer,
          { transaction }
        );
        if (!registerAnswer) {
          transaction.rollback();
          return new ApiResponse(404, "Error to create attempt", null);
        }
      }

      transaction.commit()
      return new ApiResponse(201, "success", intento);

    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Update an intento
   */
  async update(
    id: string,
    data: Partial<Intentos>
  ): Promise<ApiResponse<number | null>> {
    try {
      const [updated] = await intentosRepository.updateIntento(id, data);
      if (updated === 0)
        return new ApiResponse(404, "Intento not found or not updated", null);
      return new ApiResponse(200, "Intento updated successfully", updated);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Delete an intento
   */
  async delete(id: string): Promise<ApiResponse<number | null>> {
    try {
      const deleted = await intentosRepository.deleteIntento(id);
      if (deleted === 0)
        return new ApiResponse(404, "Intento not found or not deleted", null);
      return new ApiResponse(200, "Intento deleted successfully", deleted);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }
}

export default new IntentosService();
