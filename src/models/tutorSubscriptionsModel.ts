import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import TutorInfo from "./tutorInfoModel.js";

class TutorSubscriptions extends Model {}

TutorSubscriptions.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    tutor_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("verificacion", "posicionamiento"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "tutor_subscriptions" }
);

TutorInfo.hasMany(TutorSubscriptions, { foreignKey: "tutor_id", as: "subscriptions" });
TutorSubscriptions.belongsTo(TutorInfo, { foreignKey: "tutor_id", as: "tutor_info" });

export default TutorSubscriptions;
