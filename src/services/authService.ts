import { db } from "../core/db.js";
import admin from "../core/firebase.js";
import { ApiResponse } from "../core/responseSchedule.js";
import type User from "../models/userModel.js";
import authRepository from "../repository/authRepository.js";
import userRepository from "../repository/userRepository.js";
import bcrypt from "bcrypt";

interface DataSendLogin {
  name: string;
  email: string;
  rol: string;
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

      console.log(user.dataValues.name)

      const dataSend = {
        name: user.dataValues.name + " " + user.dataValues.last_name,
        email: user.dataValues.email,
        rol: user.dataValues.rol.name,
      };
   

      return new ApiResponse(200, "success", dataSend);

    } catch (error) {
      console.log("ERROR AWUI")
      return new ApiResponse(500, (error as Error).message, null);
    }
  }
}

export default new AuthService();
