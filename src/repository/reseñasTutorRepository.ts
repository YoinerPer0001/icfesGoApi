import { type CreationAttributes, Transaction } from "sequelize";
import ReseñasTutor from "../models/reseñasTutorModel.js";
import TutorInfo from "../models/tutorInfoModel.js";
import User from "../models/userModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class ReseñasTutorRepository {
  async findByTutor(tutor_id: string): Promise<ReseñasTutor[]> {
    return await ReseñasTutor.findAll({
      where: { tutor_id },
      include: [
        {
          model: TutorInfo,
          as: "tutor_info",
          attributes: { exclude: excludeInfo },
        },
        { model: User, as: "student", attributes: { exclude: excludeInfo } },
      ],
      attributes: { exclude: excludeInfo },
    });
  }

  async findByStudent(student_id: string): Promise<ReseñasTutor[]> {
    return await ReseñasTutor.findAll({
      where: { student_id },
      include: { model: TutorInfo, as: "tutor_info" },
    });
  }

  async create(
    data: CreationAttributes<ReseñasTutor>,
    options?: { transaction?: Transaction }
  ): Promise<ReseñasTutor> {
    return await ReseñasTutor.create(data, {
      transaction: options?.transaction ?? null,
    });
  }

  async updateOrCreate(
    data: CreationAttributes<ReseñasTutor>,
    options?: { transaction?: Transaction }
  ): Promise<[ReseñasTutor, boolean | null]> {

    return await ReseñasTutor.upsert(data, {transaction: options?.transaction ?? null});

  }

  async delete(id: string): Promise<number> {
    return await ReseñasTutor.destroy({ where: { id } });
  }
}

export default new ReseñasTutorRepository();
