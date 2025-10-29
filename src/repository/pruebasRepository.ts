import { Op, type CreationAttributes, type Transaction } from "sequelize";
import Pruebas from "../models/pruebasModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class PruebasRepository {
  /**
   * Create a new test
   */
  async createPrueba(
    data: CreationAttributes<Pruebas>,
    options?: { transaction?: Transaction | null }
  ): Promise<Pruebas> {
    const prueba = await Pruebas.create(data, {
      transaction: options?.transaction || null,
    });
    return prueba;
  }

  /**
   * Find a test by its ID
   */
  async findById(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Pruebas | null> {
    return await Pruebas.findByPk(id, {
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find a test by its name
   */
  async findByName(
    name: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Pruebas | null> {
    return await Pruebas.findOne({
      where: { name },
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Get all tests
   */
  async findAll(
    options?: { transaction?: Transaction | null }
  ): Promise<Pruebas[]> {
    return await Pruebas.findAll({
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Update a test by ID
   */
  async updatePrueba(
    id: string,
    data: Partial<CreationAttributes<Pruebas>>,
    options?: { transaction?: Transaction | null }
  ): Promise<[affectedCount: number]> {
    return await Pruebas.update(data, {
      where: { id },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Delete a test by ID
   */
  async deletePrueba(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<number> {
    return await Pruebas.destroy({
      where: { id },
      transaction: options?.transaction || null,
    });
  }
}

export default new PruebasRepository();
