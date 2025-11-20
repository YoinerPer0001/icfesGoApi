import { Op, type CreationAttributes, type Transaction } from "sequelize";
import Questions from "../models/questionsModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class QuestionsRepository {
  /**
   * Create a new question
   */
  async createQuestion(
    data: CreationAttributes<Questions>,
    options?: { transaction?: Transaction | null }
  ): Promise<Questions> {
    const question = await Questions.create(data, {
      transaction: options?.transaction || null,
    });
    return question;
  }

  /**
   * Find question by ID
   */
  async findById(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Questions | null> {
    return await Questions.findByPk(id, {
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find all questions for a specific simulacro
   */
  async findBySimulacroId(
    simulacro_id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Questions[]> {
    return await Questions.findAll({
      where: { simulacro_id },
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Get all questions
   */
  async findAll(options?: {
    transaction?: Transaction | null;
  }): Promise<Questions[]> {
    return await Questions.findAll({
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Update a question by ID
   */
  async updateQuestion(
    id: string,
    data: Partial<CreationAttributes<Questions>>,
    options?: { transaction?: Transaction | null }
  ): Promise<[affectedCount: number]> {
    return await Questions.update(data, {
      where: { id },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Delete a question by ID
   */
  async deleteQuestion(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<number> {
    return await Questions.destroy({
      where: { id },
      transaction: options?.transaction || null,
    });
  }
}

export default new QuestionsRepository();
