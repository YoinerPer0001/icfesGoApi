import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";

class Grados extends Model {}

Grados.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "grados",
  }
);

export default Grados;
