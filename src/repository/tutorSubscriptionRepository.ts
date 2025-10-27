import { type CreationAttributes, Transaction } from "sequelize";
import TutorSubscriptions from "../models/tutorSubscriptionsModel.js";
import TutorInfo from "../models/tutorInfoModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class TutorSubscriptionsRepository {
  async findById(id: string, options?: { transaction?: Transaction | null }): Promise<TutorSubscriptions | null> {
    return await TutorSubscriptions.findByPk(id, {
      transaction: options?.transaction ?? null,
      attributes: { exclude: excludeInfo },
      include: { model: TutorInfo, as: "tutor_info" },
    });
  }

  async findByTutor(tutor_id: string): Promise<TutorSubscriptions[]> {
    return await TutorSubscriptions.findAll({
      where: { tutor_id },
      attributes: { exclude: excludeInfo },
    });
  }

  async create(data: CreationAttributes<TutorSubscriptions>): Promise<TutorSubscriptions> {
    return await TutorSubscriptions.create(data);
  }

  async delete(id: string): Promise<number> {
    return await TutorSubscriptions.destroy({ where: { id } });
  }
}

export default new TutorSubscriptionsRepository();
