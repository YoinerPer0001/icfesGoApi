import { Op, type CreationAttributes, type Transaction } from "sequelize";
import Simulacros from "../models/simulacrosModel.js";
import Questions from "../models/questionsModel.js";
import Answers from "../models/answersModel.js";
import User from "../models/userModel.js";
import Areas from "../models/areasModel.js";
import Intentos from "../models/intentosModel.js";
import UserAnswers from "../models/user_answersModel.js";
import type { Where } from "sequelize/lib/utils";

const excludeInfo = ["createdAt", "updatedAt"];

class SimulacrosRepository {
  /**
   * Create a new simulacro
   */
  async createSimulacro(
    data: CreationAttributes<Simulacros>,
    options?: { transaction?: Transaction | null }
  ): Promise<Simulacros> {
    const simulacro = await Simulacros.create(data, {
      transaction: options?.transaction || null,
    });
    return simulacro;
  }

  /**
   * Find simulacro by ID
   */
  async findById(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Simulacros | null> {
    return await Simulacros.findByPk(id, {
      attributes: { exclude: excludeInfo },
      include: [
        {
          model: Questions,
          as: "questions",
          include: [{ model: Answers, as: "answers" }],
        },
      ],
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find all simulacros by area ID
   */
  async findByAreaId(
    area_id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Simulacros[]> {
    return await Simulacros.findAll({
      where: { area_id },
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find all simulacros created by a user
   */
  async findByCreator(
    creator: string,
    options?: {
      page?: number;
      limit?: number;
      area?:string | undefined;
    }
  ): Promise<{ data: Simulacros[]; total: number; totalPages: number }> {
    const page = options?.page ?? 1; // página actual (1 por defecto)
    const limit = options?.limit ?? 10; // tamaño de página (10 por defecto)
    const offset = (page - 1) * limit;

    const where: any = {
      creator : creator,
    }

    if(options?.area != undefined){
      where.area_id = options.area
    }

    // Obtener resultados + total
    const { rows, count } = await Simulacros.findAndCountAll({
      where: where,
      distinct: true, // evitar duplicados
      attributes: { exclude: ["updatedAt", "area_id", "creator"] },
      include: [
        {
          model: User, as: "user",
          attributes: ["name", "last_name"]
        },
        {
          model: Intentos,
          as: "intentos",
          attributes: { exclude: ["createdAt", "updatedAt", "simulacro_id"] },
          include: [
            {
              model: UserAnswers,
              as: "user_answers",
              attributes: { exclude: ["createdAt", "updatedAt", "intento_id"] },
            },
          ],
        },
        {
          model: Areas,
          as: "area",
          attributes: { exclude: excludeInfo },
        },
        {
          model: Questions,
          as: "questions",
          attributes: { exclude: ["createdAt", "updatedAt", "simulacro_id"] },
          include: [
            {
              model: Answers,
              as: "answers",
              attributes: { exclude: ["createdAt", "updatedAt", "question_id"] },
            },
          ],
        },
      ],
      limit,
      offset,
    });

    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
    };
  }

  /**
   * Find all public simulacros
   */
  async findPublic(
    options?: {
      page?: number;
      limit?: number;
      area?:string | undefined;
    }
  ): Promise<{ data: Simulacros[]; total: number; totalPages: number }> {
    const page = options?.page ?? 1; // página actual (1 por defecto)
    const limit = options?.limit ?? 10; // tamaño de página (10 por defecto)
    const offset = (page - 1) * limit;

    const where: any = {
      public: true
    }

    if(options?.area != undefined){
      where.area_id = options.area
    }

    // Obtener resultados + total
    const { rows, count } = await Simulacros.findAndCountAll({
      where: where,
      distinct: true, // evitar duplicados
      attributes: { exclude: ["updatedAt", "area_id", "creator"] },
      include: [
         {
          model: User, as: "user",
          attributes: ["name", "last_name"]
        },
        {
          model: Intentos,
          as: "intentos",
          attributes: { exclude: ["createdAt", "updatedAt", "simulacro_id"] },
          include: [
            {
              model: UserAnswers,
              as: "user_answers",
              attributes: { exclude: ["createdAt", "updatedAt", "intento_id"] },
            },
          ],
        },
        {
          model: Areas,
          as: "area",
          attributes: { exclude: excludeInfo },
        },
        {
          model: Questions,
          as: "questions",
          attributes: { exclude: ["createdAt", "updatedAt", "simulacro_id"] },
          include: [
            {
              model: Answers,
              as: "answers",
              attributes: { exclude: ["createdAt", "updatedAt", "question_id"] },
            },
          ],
        },
      ],
      limit,
      offset,
    });

    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
    };
  }

  /**
   * Get all simulacros
   */
  async findAll(options?: {
    transaction?: Transaction | null;
  }): Promise<Simulacros[]> {
    return await Simulacros.findAll({
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Update a simulacro
   */
  async updateSimulacro(
    id: string,
    data: Partial<CreationAttributes<Simulacros>>,
    options?: { transaction?: Transaction | null }
  ): Promise<[affectedCount: number]> {
    return await Simulacros.update(data, {
      where: { id },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Delete a simulacro
   */
  async deleteSimulacro(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<number> {
    return await Simulacros.destroy({
      where: { id },
      transaction: options?.transaction || null,
    });
  }
}

export default new SimulacrosRepository();
