import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import Roles from "./rolesModel.js";
import Cities from "./citiesModel.js";

class User extends Model {}

// Cuando se crea un user, algunos campos pueden ser opcionales
// interface UserCreationAttributes extends Optional<UserAttributes, "attempts_remaining" | "last_attempt_reset"> {}

User.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rol_id: {
     type: DataTypes.UUIDV4,
     allowNull:false
    },
    firebase_uid:{
        type: DataTypes.TEXT,
        allowNull:true
    },
    perfil_completed :{
      type: DataTypes.BOOLEAN,
      defaultValue : false
    },
    cellphone:{
      type: DataTypes.STRING(10),
      allowNull: false
    },
    city_id: {
      type:DataTypes.UUID,
      allowNull:true
    },
    photo_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    file_id:{
      type: DataTypes.STRING(100),
      allowNull: true
    }
  },
  {
    modelName: "users",
    sequelize: db,
  }
);

Cities.hasMany(User, {foreignKey: "city_id" , as : "users"})
User.belongsTo(Cities, {foreignKey: "city_id", as: "city"})

Roles.hasMany(User, {foreignKey: "rol_id", as: "users"})
User.belongsTo(Roles, {foreignKey: "rol_id", as: "rol"})

export default User;
