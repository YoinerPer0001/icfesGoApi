import { type CreationAttributes } from "sequelize";
import UserAreas from "../models/userAreasModel.js";
import Areas from "../models/areasModel.js";

class UserAreasRepository {
  async findByUser(id_user: string): Promise<UserAreas[]> {
    return await UserAreas.findAll({
      where: { id_user },
      include: { model: Areas, as: "areas" },
    });
  }

  async create(data: CreationAttributes<UserAreas>): Promise<UserAreas> {
    return await UserAreas.create(data);
  }

  async delete(id_user: string, id_area: string): Promise<number> {
    return await UserAreas.destroy({ where: { id_user, id_area } });
  }
}

export default new UserAreasRepository();
