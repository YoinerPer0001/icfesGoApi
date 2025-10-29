import type { Request, Response } from "express";
import authService from "../services/authService.js";
import * as crypto from "crypto";
import 'dotenv/config'

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
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY  ?? "";
    const token = crypto.randomBytes(16).toString("hex");
    const expire = Math.floor(Date.now() / 1000) + 2400; // expira en 40 min

    const signature = crypto
      .createHmac("sha1", privateKey)
      .update(token + expire)
      .digest("hex");

    res.json({ signature, token, expire });
  }
}

export default new AuthController();
