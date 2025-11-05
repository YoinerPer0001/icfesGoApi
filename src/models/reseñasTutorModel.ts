import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import User from "./userModel.js";
import TutorInfo from "./tutorInfoModel.js";

class ReseñasTutor extends Model {}

ReseñasTutor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.TEXT,
    },
    tutor_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
  },
  {
    sequelize: db,
    modelName: "reseñas_tutor",
    tableName: "reseñas_tutor",
    indexes: [
      {
        unique: true,
        fields: ["tutor_id", "student_id"],
      },
    ],
  }
);

TutorInfo.hasMany(ReseñasTutor, { foreignKey: "tutor_id", as: "reviews" });
ReseñasTutor.belongsTo(TutorInfo, { foreignKey: "tutor_id", as: "tutor_info" });

User.hasMany(ReseñasTutor, { foreignKey: "student_id", as: "user_reviews" });
ReseñasTutor.belongsTo(User, { foreignKey: "student_id", as: "student" });

export default ReseñasTutor;
