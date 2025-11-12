import { Op, type CreationAttributes, type Transaction } from "sequelize";
import User from "../models/userModel.js";
import Grados from "../models/gradosModel.js";
import Pruebas from "../models/pruebasModel.js";
import StudentInfo from "../models/StudentInfoModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class StudentInfoRepository {
  /**
   * Create a new student info record
   */
  async createStudentInfo(
    data: CreationAttributes<StudentInfo>,
    options?: { transaction?: Transaction | null }
  ): Promise<StudentInfo> {
    const record = await StudentInfo.create(data, {
      transaction: options?.transaction || null,
    });
    return record;
  }

  /**
   * Find student info by ID
   */
  async findById(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<StudentInfo | null> {
    return await StudentInfo.findByPk(id, {
      attributes: { exclude: excludeInfo },
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Grados, as: "grado", attributes: ["id", "name"] },
        { model: Pruebas, as: "prueba", attributes: ["id", "name"] },
      ],
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find all student info records
   */
  async findAll(options?: {
    transaction?: Transaction | null;
  }): Promise<StudentInfo[]> {
    return await StudentInfo.findAll({
      attributes: { exclude: excludeInfo },
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Grados, as: "grado", attributes: ["id", "name"] },
        { model: Pruebas, as: "prueba", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
      transaction: options?.transaction || null,
    });
  }

  /**
   * Find student info by user ID
   */
  async findByUserId(
    userId: string,
    options?: { transaction?: Transaction | null }
  ): Promise<StudentInfo | null> {
    return await StudentInfo.findOne({
      where: { user_id: userId },
      attributes: { exclude: excludeInfo },
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Grados, as: "grado", attributes: ["id", "name"] },
        { model: Pruebas, as: "prueba", attributes: ["id", "name"] },
      ],
      transaction: options?.transaction || null,
    });
  }

  /**
   * Update student info by ID
   */
  async updateStudentInfo(
    id: string,
    data: Partial<CreationAttributes<StudentInfo>>,
    options?: { transaction?: Transaction | null }
  ): Promise<[affectedCount: number]> {
    return await StudentInfo.update(data, {
      where: { user_id:id },
      transaction: options?.transaction || null,
    });
  }


  async Create(
  data: Partial<CreationAttributes<StudentInfo>>,
  options?: { transaction?: Transaction | null }
): Promise<StudentInfo | null> {
  return await StudentInfo.create(data, { transaction: options?.transaction || null });
  
}

async Upsert(
  data: Partial<CreationAttributes<StudentInfo>>,
  options?: { transaction?: Transaction | null }
): Promise<StudentInfo> {
  const [instance] = await StudentInfo.upsert(data, {
    transaction: options?.transaction || null,
    returning: true,
  });

  return instance;
}



  /**
   * Delete student info by ID
   */
  async deleteStudentInfo(
    id: string,
    options?: { transaction?: Transaction | null }
  ): Promise<number> {
    return await StudentInfo.destroy({
      where: { id },
      transaction: options?.transaction || null,
    });
  }
}

export default new StudentInfoRepository();
