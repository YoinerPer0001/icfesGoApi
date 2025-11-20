import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import User from "./userModel.js";
import Simulacros from "./simulacrosModel.js";

class Intentos extends Model {}

Intentos.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4
    },
    simulacro_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    id_user: {
        type: DataTypes.UUID,
        allowNull: true
    },
    score: {
        type: DataTypes.DOUBLE,
        allowNull: true
    }
}, {
    sequelize: db,
    modelName: "intentos"
});

User.hasMany(Intentos, { foreignKey: 'id_user', as: 'intentos' });
Intentos.belongsTo(User, { foreignKey: 'id_user', as: 'user' });

Simulacros.hasMany(Intentos, { foreignKey: 'simulacro_id', as: 'intentos' });
Intentos.belongsTo(Simulacros, { foreignKey: 'simulacro_id', as: 'simulacro' });

export default Intentos;
