import { Transaction, type CreationAttributes } from "sequelize";
import UserAreas from "../models/userAreasModel.js";
import Areas from "../models/areasModel.js";

class UserAreasRepository {
  async findByUser(id_user: string): Promise<UserAreas[]> {
    return await UserAreas.findAll({
      where: { id_user },
      include: { model: Areas, as: "areas" },
    });
  }

  async create(
    data: CreationAttributes<UserAreas>,
    options?: { transaction?: Transaction | null }
  ): Promise<UserAreas> {
    return await UserAreas.create(data, {
      transaction: options?.transaction || null,
    });
  }

  async upsert(
  data: CreationAttributes<UserAreas>,
  options?: { transaction?: Transaction | null }
): Promise<UserAreas> {
  const [record] = await UserAreas.upsert(data, {
    transaction: options?.transaction || null,
    returning: true,
  });

  return record;
}


  async delete(id_user: string, id_area: string): Promise<number> {
    return await UserAreas.destroy({ where: { id_user, id_area } });
  }

  async deleteByUserId(id_user: string, options?: { transaction?: Transaction | null }): Promise<number> {
    return await UserAreas.destroy({ where: { id_user }, transaction: options?.transaction || null });
  }
}

export default new UserAreasRepository();
