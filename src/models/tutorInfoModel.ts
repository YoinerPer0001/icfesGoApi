import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import User from "./userModel.js";

class TutorInfo extends Model {}

TutorInfo.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sobre_mi: {
      type: DataTypes.TEXT,
    },
    precio_hora: {
      type: DataTypes.FLOAT,
    },
    sesiones_type: {
      type: DataTypes.ENUM("presenciales", "virtuales"),
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "tutor_info" }
);

User.hasOne(TutorInfo, { foreignKey: "user_id", as: "tutor_info" });
TutorInfo.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default TutorInfo;

