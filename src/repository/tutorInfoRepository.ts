import { Transaction, type CreationAttributes } from "sequelize";
import TutorInfo from "../models/tutorInfoModel.js";
import User from "../models/userModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class TutorInfoRepository {
  async findById(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<TutorInfo | null> {
    return await TutorInfo.findByPk(id, {
      transaction: options?.transaction ?? null,
      attributes: { exclude: excludeInfo },
      include: {
        model: User,
        as: "user",
        attributes: { exclude: excludeInfo },
      },
    });
  }

  async findByUserId(user_id: string): Promise<TutorInfo | null> {
    return await TutorInfo.findOne({
      where: { user_id },
      include: {
        model: User,
        as: "user",
        attributes: { exclude: excludeInfo },
      },
    });
  }

  async getAll(): Promise<TutorInfo[]> {
    return await TutorInfo.findAll({
      attributes: { exclude: excludeInfo },
      include: {
        model: User,
        as: "user",
        attributes: { exclude: excludeInfo },
      },
    });
  }


  async update(
    id: string,
    data: Partial<CreationAttributes<TutorInfo>>,
    options?: { transaction?: Transaction | null }
  ): Promise<number> {
    const [affectedRows] = await TutorInfo.update(data, {
      where: { user_id: id },
      transaction: options?.transaction ?? null,
    });
    return affectedRows;
  }

  async drop(id: string): Promise<number> {
    return await TutorInfo.destroy({ where: { id } });
  }

  async create(
    data: Partial<CreationAttributes<TutorInfo>>,
    options?: { transaction?: Transaction | null }
  ): Promise<TutorInfo | null> {
    return await TutorInfo.create(
      data, // el id debe estar dentro del objeto
      { transaction: options?.transaction || null }
    );
  }

  async upsert(
  data: Partial<CreationAttributes<TutorInfo>>,
  options?: { transaction?: Transaction | null }
): Promise<TutorInfo | null> {
  const [record] = await TutorInfo.upsert(data, {
    transaction: options?.transaction || null,
    returning: true, // asegura que Sequelize devuelva el registro
  });

  return record;
}

}

export default new TutorInfoRepository();
