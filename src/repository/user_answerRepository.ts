import { Op, type CreationAttributes, type Transaction } from "sequelize";
import UserAnswers from "../models/user_answersModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class UserAnswersRepository {
  /**
   * Create a new user answer record
   */
  async createUserAnswer(
    data: CreationAttributes<UserAnswers>,
    options?: { transaction?: Transaction | null }
  ): Promise<UserAnswers> {
    const userAnswer = await UserAnswers.create(data, {
      transaction: options?.transaction || null,
    });
    return userAnswer;
  }

  /**
   * Find a record by ID
   */
  async findById(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<UserAnswers | null> {
    return await UserAnswers.findByPk(id, {
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find all user answers for a specific intento
   */
  async findByIntentoId(
    intento_id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<UserAnswers[]> {
    return await UserAnswers.findAll({
      where: { intento_id },
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find all user answers for a specific question
   */
  async findByQuestionId(
    question_id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<UserAnswers[]> {
    return await UserAnswers.findAll({
      where: { question_id },
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find all records using a specific answer
   */
  async findByAnswerId(
    answer_id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<UserAnswers[]> {
    return await UserAnswers.findAll({
      where: { answer_id },
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Get all user answers
   */
  async findAll(options?: {
    transaction?: Transaction | null;
  }): Promise<UserAnswers[]> {
    return await UserAnswers.findAll({
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Update a user answer record
   */
  async updateUserAnswer(
    id: string,
    data: Partial<CreationAttributes<UserAnswers>>,
    options?: { transaction?: Transaction | null }
  ): Promise<[affectedCount: number]> {
    return await UserAnswers.update(data, {
      where: { id },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Delete a user answer record
   */
  async deleteUserAnswer(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<number> {
    return await UserAnswers.destroy({
      where: { id },
      transaction: options?.transaction || null,
    });
  }
}

export default new UserAnswersRepository();
