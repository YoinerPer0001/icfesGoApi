import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";

class Areas extends Model {}

Areas.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "areas" }
);

export default Areas;

