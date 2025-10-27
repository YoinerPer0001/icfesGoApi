import { type CreationAttributes, Transaction } from "sequelize";
import Notifications from "../models/notificationsModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class NotificationsRepository {
  async findByUser(user_id: string): Promise<Notifications[]> {
    return await Notifications.findAll({
      where: { user_id },
      attributes: { exclude: excludeInfo },
    });
  }

  async create(data: CreationAttributes<Notifications>): Promise<Notifications> {
    return await Notifications.create(data);
  }

  async delete(id: string): Promise<number> {
    return await Notifications.destroy({ where: { id } });
  }
}

export default new NotificationsRepository();
