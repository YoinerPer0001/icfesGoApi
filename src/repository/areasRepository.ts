import { Op, type CreationAttributes, type Transaction } from "sequelize";
import Areas from "../models/areasModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class AreasRepository {
  /**
   * Create a new area
   */
  async createArea(
    data: CreationAttributes<Areas>,
    options?: { transaction?: Transaction | null }
  ): Promise<Areas> {
    const area = await Areas.create(data, {
      transaction: options?.transaction || null,
    });
    return area;
  }

  /**
   * Find an area by its ID
   */
  async findById(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Areas | null> {
    return await Areas.findByPk(id, {
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find an area by its name
   */
  async findByName(
    name: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Areas | null> {
    return await Areas.findOne({
      where: { name },
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Get all areas
   */
  async findAll(options?: {
    transaction?: Transaction | null;
  }): Promise<Areas[]> {
    return await Areas.findAll({
      attributes: { exclude: excludeInfo },
      order: [["name", "ASC"]],
      transaction: options?.transaction || null,
    });
  }

  /**
   * Update an area by ID
   */
  async updateArea(
    id: string,
    data: Partial<CreationAttributes<Areas>>,
    options?: { transaction?: Transaction | null }
  ): Promise<[affectedCount: number]> {
    return await Areas.update(data, {
      where: { id },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Delete an area by ID
   */
  async deleteArea(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<number> {
    return await Areas.destroy({
      where: { id },
      transaction: options?.transaction || null,
    });
  }
}

export default new AreasRepository();
