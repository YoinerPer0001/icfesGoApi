import type { Request, Response } from "express";
import authService from "../services/authService.js";
import * as crypto from "crypto";
import 'dotenv/config'
import jwt from 'jsonwebtoken'

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

    console.log(req.body)

    try {

  
      const token = await jwt.sign(req.body.uploadPayload, process.env.IMAGEKIT_PRIVATE_KEY ?? "",
        {
        expiresIn: req.body.expire,
        header: {
        alg: "HS256",
        typ: "JWT",
        kid: req.body.uploadPayload.publicKey,
      }});

      res.status(200).json({ code:200 , message: "success", data: {token} });
      
    } catch (error) {
      res.status(500).json({ message: error, data: {} });
    }
  }

}

export default new AuthController();
