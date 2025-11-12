import type { CreationAttributes } from "sequelize";
import imagekit from "../core/imageKit.js";
import { ApiResponse } from "../core/responseSchedule.js";
import Certificates from "../models/certificatesModel.js";
import certificatesRepository from "../repository/certificatesRepository.js";
import tutorInfoRepository from "../repository/tutorInfoRepository.js";
import userRepository from "../repository/userRepository.js";

class CertificatesService {
  // Crear un nuevo certificado
  async create(idTutor:string ,data: Partial<Certificates>) : Promise<ApiResponse<Certificates | null>> {
    try {
      const user = await userRepository.findByFirebaseId(idTutor);
      if (!user) {
        return new ApiResponse(404, "User not found", null);
      }

      const isTutor = await tutorInfoRepository.findByUserId(user.dataValues.id);
      if (!isTutor) {
        return new ApiResponse(403, "User is not a tutor", null);
      }
      const dataCreate = {
        ...data,
        tutor_id: isTutor.dataValues.id
      }

      const result = await certificatesRepository.create(dataCreate);
      return new ApiResponse(201, "Certificate created successfully", null);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }

  // Eliminar un certificado por ID
  async delete(idUser: string, idCertificate: string, file:string) : Promise<ApiResponse<null>> {
    try {
      const user = await userRepository.findByFirebaseId(idUser);
      if (!user) {
        return new ApiResponse(404, "User not found", null);
      }

      const isTutor = await tutorInfoRepository.findByUserId(
        user.dataValues.id
      );
      if (!isTutor) {
        return new ApiResponse(403, "User is not a tutor", null);
      }

      const certificates = await certificatesRepository.findByTutor(
        isTutor.dataValues.id
      );

      const deleteFile = await imagekit.deleteFile(file)

      if (certificates.length > 1) {
        const deletedCount = await certificatesRepository.delete(idCertificate);

        if (deletedCount === 0) {
          return new ApiResponse(404, "Certificate not found", null);
        }

        return new ApiResponse(200, "Certificate deleted successfully", null);

      }else{
        return new ApiResponse(400, "At least one certificate must be retained", null);
      }

      return new ApiResponse(200, "Certificate deleted successfully", null);
    } catch (error) {
      return new ApiResponse(500, (error as Error).message, null);
    }
  }
}

export default new CertificatesService();
