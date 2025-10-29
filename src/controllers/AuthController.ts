import type { Request, Response } from "express";
import authService from "../services/authService.js";
import * as crypto from "crypto";
import "dotenv/config";
import jwt from "jsonwebtoken";

class AuthController {
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const response = await authService.login(email, password);

      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: error, data: {} });
    }
  }

  public async loginFirebase(req: Request, res: Response) {
    try {
      const user_id = (req as any).uid;

      const response = await authService.loginFirebase(user_id);

      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: error, data: {} });
    }
  }

  public async register(req: Request, res: Response) {
    try {
      const firebase_uid = (req as any).uid;
      const data = req.body;

      const creationData = {
        firebase_uid,
        name: data.name,
        last_name: data.last_name,
        email: data.email,
        rol_id: data.rol_id,
        cellphone: data.cellphone,
      };

      const response = await authService.register(creationData);
      res.status(response.code).json(response);
    } catch (error) {
      res.status(500).json({ message: error, data: {} });
    }
  }

  async signImageKit(req: Request, res: Response) {
    try {
      // 🔹 Extraemos el payload que contiene los mismos campos usados en Android
      const uploadPayload = req.body.uploadPayload;
      console.log(req.body);
      // 🔹 Firmamos el JWT con la PRIVATE API KEY de ImageKit
      const token = jwt.sign(
        uploadPayload,
        process.env.IMAGEKIT_PRIVATE_KEY ?? "",
        {
          expiresIn: req.body.expire,
          header: {
            alg: "HS256",
            typ: "JWT",
            kid: req.body.publicKey,
          },
        }
      );

      // 🔹 Devolvemos la respuesta estándar
      res.status(200).json({
        code: 200,
        message: "success",
        data: { token },
      });
    } catch (error) {
      console.error("❌ Error al firmar token:", error);
      res.status(500).json({
        message: "Error al generar el token",
        data: {},
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  
}

export default new AuthController();
