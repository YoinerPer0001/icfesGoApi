import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import TutorInfo from "./tutorInfoModel.js";


class PaymentInfo extends Model {}

PaymentInfo.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    nombre_titular: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tutor_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("ahorros", "corriente"),
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "payment_info" }
);

TutorInfo.hasOne(PaymentInfo, { foreignKey: "tutor_id", as: "payment_info" });
PaymentInfo.belongsTo(TutorInfo, { foreignKey: "tutor_id", as: "tutor_info" });

export default PaymentInfo;
