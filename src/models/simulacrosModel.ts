import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import User from "./userModel.js";
import Areas from "./areasModel.js";

class Simulacros extends Model {}

Simulacros.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4
    },
    area_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    creator: {
        type: DataTypes.UUID,
        allowNull: true
    },
    public: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    time_question: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize: db,
    modelName: "simulacros",
});

User.hasMany(Simulacros, { foreignKey: 'creator', as: 'simulacros' });
Simulacros.belongsTo(User, { foreignKey: 'creator', as: 'user' });

Areas.hasMany(Simulacros, { foreignKey: 'area_id', as: 'simulacros' });
Simulacros.belongsTo(Areas, { foreignKey: 'area_id', as: 'area' });

export default Simulacros;
