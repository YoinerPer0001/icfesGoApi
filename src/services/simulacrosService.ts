import type { CreationAttributes } from "sequelize";
import { ApiResponse } from "../core/responseSchedule.js";
import type Answers from "../models/answersModel.js";
import type Questions from "../models/questionsModel.js";
import type Simulacros from "../models/simulacrosModel.js";
import simulacrosRepository from "../repository/simulacrosRepository.js";
import { db } from "../core/db.js";
import questionRepository from "../repository/questionRepository.js";
import answerRepository from "../repository/answerRepository.js";
import userRepository from "../repository/userRepository.js";
import Intentos from "../models/intentosModel.js";
import intentosRepository from "../repository/intentosRepository.js";
import user_answerRepository from "../repository/user_answerRepository.js";

interface QuestionAnswerPair {
  question: Partial<CreationAttributes<Questions>>;
  answers: Partial<CreationAttributes<Answers>[]>;
}

interface CreateSimulacroDTO {
  simulacro: Partial<CreationAttributes<Simulacros>>;
  data: QuestionAnswerPair[];
}

class SimulacrosService {
  /**
   * Get all simulacros
   */
  async getAll(): Promise<ApiResponse<Simulacros[] | null>> {
    try {
      const result = await simulacrosRepository.findAll();
      return new ApiResponse(200, "success", result);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Get simulacro by ID
   */
  async getById(id: string): Promise<ApiResponse<Simulacros | null>> {
    try {
      const simulacro = await simulacrosRepository.findById(id);
      if (!simulacro) return new ApiResponse(404, "Simulacro not found", null);

      return new ApiResponse(200, "success", simulacro);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  async getByCreator(
    id: string,
    page: number,
    limit: number,
    area?: string | undefined
  ): Promise<
    ApiResponse<{
      data: Simulacros[];
      total: number;
      totalPages: number;
    } | null>
  > {
    try {
      const user = await userRepository.findByFirebaseId(id);
      if (!user) {
        return new ApiResponse(404, "not found", null);
      }
      const simulacros = await simulacrosRepository.findByCreator(
        user.dataValues.id,
        { page, limit, area }
      );
      return new ApiResponse(200, "success", simulacros);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  async getPublic(
    page: number,
    limit: number,
    area?: string | undefined
  ): Promise<
    ApiResponse<{
      data: Simulacros[];
      total: number;
      totalPages: number;
    } | null>
  > {
    try {
      const simulacros = await simulacrosRepository.findPublic({
        page,
        limit,
        area,
      });
      return new ApiResponse(200, "success", simulacros);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Create a new simulacro
   */
  async create(
    userId: string,
    data: CreateSimulacroDTO
  ): Promise<ApiResponse<Simulacros | null>> {
    const transaction = await db.transaction();
    try {
      const user = await userRepository.findByFirebaseId(userId);
      if (!user) {
        await transaction.rollback();
        return new ApiResponse(404, "User not found", null);
      }
      data.simulacro.creator = user.dataValues.id;
      // 1. Create the simulacro
      const simulacro = await simulacrosRepository.createSimulacro(
        data.simulacro,
        { transaction }
      );
      if (!simulacro) {
        await transaction.rollback();
        return new ApiResponse(500, "Failed to create simulacro", null);
      }

      // 2. Here you would typically create questions and answers associated with the simulacro
      const simulacroId = simulacro.dataValues.id;
      for (const qaPair of data.data) {
        // Create question with simulacroId
        qaPair.question.simulacro_id = simulacroId;
        const questionCreated = await questionRepository.createQuestion(
          qaPair.question,
          { transaction }
        );
        if (!questionCreated) {
          await transaction.rollback();
          return new ApiResponse(500, "Failed to create question", null);
        }
        // Create answers associated with the question
        const questionId = questionCreated.dataValues.id;
        for (const answerData of qaPair.answers) {
          if (answerData) {
            answerData.question_id = questionId;
            const answerCreated = await answerRepository.createAnswer(
              answerData,
              { transaction }
            );
            if (!answerCreated) {
              await transaction.rollback();
              return new ApiResponse(500, "Failed to create answer", null);
            }
          }
        }
      }

      // Ensure to use the same transaction
      await transaction.commit();
      return new ApiResponse(201, "Simulacro created successfully", simulacro);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Update an existing simulacro
   */
  async update(
    id: string,
    data: Partial<Simulacros>
  ): Promise<ApiResponse<number | null>> {
    try {
      const [updated] = await simulacrosRepository.updateSimulacro(id, data);
      if (updated === 0)
        return new ApiResponse(404, "Simulacro not found or not updated", null);

      return new ApiResponse(200, "Simulacro updated successfully", updated);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  /**
   * Delete a simulacro
   */
  async delete(uid: string, id: string): Promise<ApiResponse<number | null>> {
    try {
      const user = await userRepository.findByFirebaseId(uid);
      if (!user) {
        return new ApiResponse(404, "User not found", null);
      }
      const simulacro = await simulacrosRepository.findById(id);
      if (simulacro?.dataValues.creator == user.dataValues.id) {
        const deleted = await simulacrosRepository.deleteSimulacro(id);
        if (deleted === 0)
          return new ApiResponse(
            404,
            "Simulacro not found or not deleted",
            null
          );
        return new ApiResponse(200, "Simulacro deleted successfully", deleted);
      } else {
        return new ApiResponse(403, "No permmissions", null);
      }
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }
}

export default new SimulacrosService();
