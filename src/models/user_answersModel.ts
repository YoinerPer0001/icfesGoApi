import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import Questions from "./questionsModel.js";
import Intentos from "./intentosModel.js";
import Answers from "./answersModel.js";

class UserAnswers extends Model {}

UserAnswers.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4
    },
    intento_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    question_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    answer_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
}, {
    sequelize: db,
    modelName: "user_answers"
});

Intentos.hasMany(UserAnswers, { foreignKey: 'intento_id', as: 'user_answers' });
UserAnswers.belongsTo(Intentos, { foreignKey: 'intento_id', as: 'intento' });

Answers.hasMany(UserAnswers, { foreignKey: 'answer_id', as: 'user_answers' });
UserAnswers.belongsTo(Answers, { foreignKey: 'answer_id', as: 'answer' });

Questions.hasMany(UserAnswers, { foreignKey: 'question_id', as: 'user_answers' });
UserAnswers.belongsTo(Questions, { foreignKey: 'question_id', as: 'question' });




export default UserAnswers;
