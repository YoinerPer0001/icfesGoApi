import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import User from "./userModel.js";

class Notifications extends Model {}

Notifications.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("info", "warning", "maintenance", "update"),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "notifications" }
);

User.hasMany(Notifications, { foreignKey: "user_id", as: "notifications" });
Notifications.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default Notifications;
