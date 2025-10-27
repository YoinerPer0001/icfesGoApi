import { DataTypes, Model, UUIDV4 } from "sequelize";
import { db } from "../core/db.js";
import TutorInfo from "./tutorInfoModel.js";


class Certificates extends Model{}

Certificates.init({

    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    tutor_id:{
        type: DataTypes.UUID,
        allowNull: false
    },
    url_resource:{
        type: DataTypes.TEXT,
    },
    issued_at:{
        type: DataTypes.DATE,
        defaultValue: Date.now()
    },

}, {sequelize: db, modelName: "certificates"})

TutorInfo.hasMany(Certificates, {foreignKey: "tutor_id", as: "certificates"})
Certificates.belongsTo(TutorInfo, {foreignKey: "tutor_id", as: "tutor_info"})


export default Certificates;
