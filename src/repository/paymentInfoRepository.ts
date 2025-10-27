import { type CreationAttributes, Transaction } from "sequelize";
import PaymentInfo from "../models/paymentInfoModel.js";
import TutorInfo from "../models/tutorInfoModel.js";

const excludeInfo = ["createdAt", "updatedAt"];

class PaymentInfoRepository {
  async findByTutor(tutor_id: string): Promise<PaymentInfo | null> {
    return await PaymentInfo.findOne({
      where: { tutor_id },
      include: { model: TutorInfo, as: "tutor_info" },
      attributes: { exclude: excludeInfo },
    });
  }

  async create(data: CreationAttributes<PaymentInfo>): Promise<PaymentInfo> {
    return await PaymentInfo.create(data);
  }

  async update(tutor_id: string, data: Partial<CreationAttributes<PaymentInfo>>, options?: { transaction?: Transaction | null }): Promise<number> {
    const [affectedRows] = await PaymentInfo.update(data, {
      where: { tutor_id },
      transaction: options?.transaction ?? null,
    });
    return affectedRows;
  }

  async delete(tutor_id: string): Promise<number> {
    return await PaymentInfo.destroy({ where: { tutor_id } });
  }
}

export default new PaymentInfoRepository();
