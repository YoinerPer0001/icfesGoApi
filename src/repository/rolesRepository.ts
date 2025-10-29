import { Op, type CreationAttributes, type Transaction } from "sequelize";
import Roles from "../models/rolesModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class RolesRepository {
  /**
   * Create a new role
   */
  async createRole(
    data: CreationAttributes<Roles>,
    options?: { transaction?: Transaction | null }
  ): Promise<Roles> {
    const role = await Roles.create(data, {
      transaction: options?.transaction || null,
    });
    return role;
  }

  /**
   * Find a role by its ID
   */
  async findById(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Roles | null> {
    return await Roles.findByPk(id, {
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find a role by its name
   */
  async findByName(
    name: string,
    options?: { transaction?: Transaction | null }
  ): Promise<Roles | null> {
    return await Roles.findOne({
      where: { name },
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Get all roles
   */
  async findAll(options?: {
    transaction?: Transaction | null;
  }): Promise<Roles[]> {
    return await Roles.findAll({
      where: {
        name: { [Op.ne]: "admin" },
      },
      attributes: { exclude: excludeInfo },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Update a role by ID
   */
  async updateRole(
    id: string,
    data: Partial<CreationAttributes<Roles>>,
    options?: { transaction?: Transaction | null }
  ): Promise<[affectedCount: number]> {
    return await Roles.update(data, {
      where: { id },
      transaction: options?.transaction || null,
    });
  }

  /**
   * Delete a role by ID
   */
  async deleteRole(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<number> {
    return await Roles.destroy({
      where: { id },
      transaction: options?.transaction || null,
    });
  }
}

export default new RolesRepository();
