import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import Grados from "./gradosModel.js";
import Pruebas from "./pruebasModel.js";
import User from "./userModel.js";

class StudentInfo extends Model {}

StudentInfo.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    id_grado: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    test_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "students_info", tableName : "students_info" }
);

Grados.hasMany(StudentInfo, {foreignKey: "id_grado", as: "students_info"})
StudentInfo.belongsTo(Grados, {foreignKey: "id_grado", as: "grado"})

Pruebas.hasMany(StudentInfo, {foreignKey: "test_type_id", as: "students_info"})
StudentInfo.belongsTo(Pruebas, {foreignKey: "test_type_id", as: "prueba"})

User.hasOne(StudentInfo, {foreignKey: "user_id", as: "students_info"})
StudentInfo.belongsTo(Pruebas, {foreignKey: "user_id", as: "user"})

export default StudentInfo;

