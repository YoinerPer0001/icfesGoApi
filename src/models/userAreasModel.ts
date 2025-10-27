import { DataTypes, Model } from "sequelize";
import { db } from "../core/db.js";
import User from "./userModel.js";
import Areas from "./areasModel.js";


class UserAreas extends Model {}

UserAreas.init(
  {
    id_user: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    id_area: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  },
  { sequelize: db, modelName: "user_areas", timestamps: false }
);

User.belongsToMany(Areas, { through: UserAreas, foreignKey: "id_user", as: "areas" });
Areas.belongsToMany(User, { through: UserAreas, foreignKey: "id_area", as: "users" });

export default UserAreas;

