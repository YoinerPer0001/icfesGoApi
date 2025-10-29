import { Op, type CreationAttributes, type Transaction } from "sequelize";
import Grados from "../models/gradosModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class GradosRepository {
  /**
   * Create a new grade
   */
  async createGrado(
    data: CreationAttributes<Grados>,
    options?: { transaction?: Transaction | null }
  ): Promise<Grados> {
    const grado = await Grados.create(data, {
      transaction: options?.transaction || null,
    });
    return grado;
  }

  /**
   * Find a grade by its ID
   */
  async findById(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Grados | null> {
    return await Grados.findByPk(id, {
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find a grade by its name
   */
  async findByName(
    name: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Grados | null> {
    return await Grados.findOne({
      where: { name },
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Get all grades
   */
  async findAll(
    options?: { transaction?: Transaction | null }
  ): Promise<Grados[]> {
    return await Grados.findAll({
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Update a grade by ID
   */
  async updateGrado(
    id: string,
    data: Partial<CreationAttributes<Grados>>,
    options?: { transaction?: Transaction | null }
  ): Promise<[affectedCount: number]> {
    return await Grados.update(data, {
      where: { id },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Delete a grade by ID
   */
  async deleteGrado(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<number> {
    return await Grados.destroy({
      where: { id },
      transaction: options?.transaction || null,
    });
  }
}

export default new GradosRepository();
