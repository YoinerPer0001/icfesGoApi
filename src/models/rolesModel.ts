import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";


class Roles extends Model {}

Roles.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
         type: DataTypes.UUID,
         allowNull:false
    }
}, {sequelize:db, modelName: "roles"})

export default Roles

