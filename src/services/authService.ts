import {
  UniqueConstraintError,
  ValidationErrorItem,
  type CreationAttributes,
} from "sequelize";
import { db } from "../core/db.js";
import admin from "../core/firebase.js";
import { ApiResponse } from "../core/responseSchedule.js";
import type User from "../models/userModel.js";
import authRepository from "../repository/authRepository.js";
import userRepository from "../repository/userRepository.js";
import bcrypt from "bcrypt";
import type StudentInfo from "../models/StudentInfoModel.js";
import studentInfoRepository from "../repository/studentInfoRepository.js";
import userAreasRepository from "../repository/userAreasRepository.js";
import type Areas from "../models/areasModel.js";

interface DataSendLogin {
  name: string;
  email: string;
  rol: string;
  perfil_completed:boolean
}

class AuthService {
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<DataSendLogin | null>> {
    const transaction = await db.transaction();
    try {
      const user = await userRepository.findByEmail(email, { transaction });

      if (!user) {
        return new ApiResponse(404, "error", null);
      }

      const isTruePassword = await bcrypt.compare(
        password,
        user.dataValues.password
      );

      if (!isTruePassword) {
        return new ApiResponse(401, "Autentication error", null);
      }

      // si el usuario aún no está migrado a firebase
      if (!user.dataValues.firebase_uid) {
        const fbUser = await admin.auth().createUser({
          displayName: user.dataValues.name,
          email,
          password,
        });

        // guarda el UID de firebase en db
        await userRepository.update(
          user.dataValues.id,
          {
            firebase_uid: fbUser.uid,
          },
          { transaction }
        );
      }

      transaction.commit();

      const dataSend = {
        name: user.dataValues.name + " " + user.dataValues.last_name,
        email: user.dataValues.email,
        rol: user.dataValues.rol.name,
        perfil_completed: user.dataValues.perfil_completed,
      };

      return new ApiResponse(200, "success", dataSend);
    } catch (error) {
      transaction.rollback();
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  async loginFirebase(id: string): Promise<ApiResponse<DataSendLogin | null>> {
    try {
      const user = await userRepository.findByFirebaseId(id);
      if (!user) {
        return new ApiResponse(404, "error", null);
      }

      console.log(user.dataValues.name);

      const dataSend = {
        name: user.dataValues.name + " " + user.dataValues.last_name,
        email: user.dataValues.email,
        rol: user.dataValues.rol.name,
        perfil_completed: user.dataValues.perfil_completed,
      };

      return new ApiResponse(200, "success", dataSend);
    } catch (error) {
      console.log("ERROR AWUI");
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  async register(
    data: CreationAttributes<User>
  ): Promise<ApiResponse<DataSendLogin | null>> {
    try {
      const created = await authRepository.createUser(data);
      if (!created) {
        return new ApiResponse(500, "error", null);
      }

      console.log(created.dataValues);

      const dataSend = {
        name: created.dataValues.name + " " + created.dataValues.last_name,
        email: created.dataValues.email,
        rol: created.dataValues.rol.name,
        perfil_completed: created.dataValues.perfil_completed,
      };

      return new ApiResponse(200, "success", dataSend);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        console.log(error);
        const errors = (error as UniqueConstraintError).errors;
        let message = "";
        errors.forEach((e) => {
          message = e.message;
        });
        return new ApiResponse(409, message, null);
      }

      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  async UpdateStudentInfo(
    id_user:string,
    dataUser:Partial<CreationAttributes<User>>, //ciudad
    dataStudent:Partial<CreationAttributes<StudentInfo>>, //id_grado y test_type_id
    listAreas: Array<Partial<CreationAttributes<Areas>>> // lista name areas
  ) {
    const transaction = await db.transaction()

    try {

      const user = await userRepository.findByFirebaseId(id_user)
      console.log(user)

      if(!user){
        return new ApiResponse(403, "client error: invalid user", null);
      }

      dataStudent.user_id = user.dataValues.id

      const studentUpdate = await studentInfoRepository.updateOrCreateStudentInfo(user.dataValues.id, dataStudent)
      if(!studentUpdate[0]){
        console.log(studentUpdate)
        transaction.rollback()
        return new ApiResponse(500, "server error: update Student", null);
      }

      
      for (let area of listAreas){
          area.id_user = user.dataValues.id
          console.log(area)
          const createUserAreas = await userAreasRepository.create(area, {transaction})
          if(!createUserAreas){
            transaction.rollback()
            return new ApiResponse(500, "server error: create areas", null);
          }
      }


      dataUser.perfil_completed = true
      const userUpdated = await userRepository.update(user.dataValues.id, dataUser, {transaction})
      if(!userUpdated){
        transaction.rollback()
        return new ApiResponse(500, "server error: update User", null);
      }


      transaction.commit()

      const dataSend = {
        name: user.dataValues.name + " " + user.dataValues.last_name,
        email: user.dataValues.email,
        rol: user.dataValues.rol.name,
        perfil_completed: true,
      };

      return new ApiResponse(200, "success", dataSend);
      
    } catch (error) {
      transaction.rollback()
      return new ApiResponse(500, (error as Error).message, null);
    }

  }
}

export default new AuthService();
