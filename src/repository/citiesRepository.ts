import { Op, type CreationAttributes, type Transaction } from "sequelize";
import Cities from "../models/citiesModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class CitiesRepository {
  /**
   * Create a new city
   */
  async createCity(
    data: CreationAttributes<Cities>,
    options?: { transaction?: Transaction | null }
  ): Promise<Cities> {
    const city = await Cities.create(data, {
      transaction: options?.transaction || null,
    });
    return city;
  }

  /**
   * Find a city by its ID
   */
  async findById(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Cities | null> {
    return await Cities.findByPk(id, {
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find a city by its name
   */
  async findByName(
    name: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Cities | null> {
    return await Cities.findOne({
      where: { name },
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Get all cities
   */
  async findAll(
    options?: { transaction?: Transaction | null }
  ): Promise<Cities[]> {
    return await Cities.findAll({
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Update a city by ID
   */
  async updateCity(
    id: string,
    data: Partial<CreationAttributes<Cities>>,
    options?: { transaction?: Transaction | null }
  ): Promise<[affectedCount: number]> {
    return await Cities.update(data, {
      where: { id },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Delete a city by ID
   */
  async deleteCity(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<number> {
    return await Cities.destroy({
      where: { id },
      transaction: options?.transaction || null,
    });
  }
}

export default new CitiesRepository();
