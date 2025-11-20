import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import Simulacros from "./simulacrosModel.js";

class Questions extends Model {}

Questions.init({
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
    context: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize: db,
    modelName: "questions"
});

Simulacros.hasMany(Questions, { foreignKey: 'simulacro_id', as: 'questions' });
Questions.belongsTo(Simulacros, { foreignKey: 'simulacro_id', as: 'simulacro' });

export default Questions;
