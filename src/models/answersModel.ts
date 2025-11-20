import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import Questions from "./questionsModel.js";

class Answers extends Model {}

Answers.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4
    },
    question_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, {
    sequelize: db,
    modelName: "answers"
});

Questions.hasMany(Answers, { foreignKey: 'question_id', as: 'answers' });
Answers.belongsTo(Questions, { foreignKey: 'question_id', as: 'question' });

export default Answers;
