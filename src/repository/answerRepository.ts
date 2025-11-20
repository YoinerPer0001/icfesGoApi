import { Op, type CreationAttributes, type Transaction } from "sequelize";
import Answers from "../models/answersModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class AnswersRepository {
  /**
   * Create a new answer
   */
  async createAnswer(
    data: CreationAttributes<Answers>,
    options?: { transaction?: Transaction | null }
  ): Promise<Answers> {
    const answer = await Answers.create(data, {
      transaction: options?.transaction || null,
    });
    return answer;
  }

  /**
   * Find answer by ID
   */
  async findById(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Answers | null> {
    return await Answers.findByPk(id, {
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find all answers of a question
   */
  async findByQuestionId(
    question_id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Answers[]> {
    return await Answers.findAll({
      where: { question_id },
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Get all answers
   */
  async findAll(options?: {
    transaction?: Transaction | null;
  }): Promise<Answers[]> {
    return await Answers.findAll({
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Update answer by ID
   */
  async updateAnswer(
    id: string,
    data: Partial<CreationAttributes<Answers>>,
    options?: { transaction?: Transaction | null }
  ): Promise<[affectedCount: number]> {
    return await Answers.update(data, {
      where: { id },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Delete an answer by ID
   */
  async deleteAnswer(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<number> {
    return await Answers.destroy({
      where: { id },
      transaction: options?.transaction || null,
    });
  }
}

export default new AnswersRepository();
