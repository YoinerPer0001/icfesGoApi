import { type CreationAttributes, Transaction } from "sequelize";
import Certificates from "../models/certificatesModel.js";
import TutorInfo from "../models/tutorInfoModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class CertificatesRepository {
  async findById(id: string, options?: { transaction?: Transaction | null }): Promise<Certificates | null> {
    return await Certificates.findByPk(id, {
      transaction: options?.transaction ?? null,
      attributes: { exclude: excludeInfo },
      include: { model: TutorInfo, as: "tutor_info" },
    });
  }

  async findByTutor(tutor_id: string): Promise<Certificates[]> {
    return await Certificates.findAll({
      where: { tutor_id },
      attributes: { exclude: excludeInfo },
    });
  }

  async create(data: CreationAttributes<Certificates>): Promise<Certificates> {
    return await Certificates.create(data);
  }

  async delete(id: string): Promise<number> {
    return await Certificates.destroy({ where: { id } });
  }
}

export default new CertificatesRepository();
