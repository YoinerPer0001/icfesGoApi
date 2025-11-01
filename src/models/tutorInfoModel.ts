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
      allowNull: false,
    },
    precio_hora: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    biografia:{
      type:DataTypes.TEXT,
      allowNull: false,
    },
    sesiones_type: {
      type: DataTypes.ENUM("presenciales", "virtuales", "presenciales y virtuales"),
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "tutor_info", tableName: "tutor_info" }
);

User.hasOne(TutorInfo, { foreignKey: "user_id", as: "tutor_info" });
TutorInfo.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default TutorInfo;

