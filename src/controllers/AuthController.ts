import type { Request, Response } from "express";
import authService from "../services/authService.js";


class AuthController {

    public async login(req : Request, res: Response){
        try {
            const {email, password} = req.body

            const response = await authService.login(email, password)

            res.status(response.code).json(response)
            
        } catch (error) {
            res.status(500).json({message: error, data: {}});
        }
    }

    public async loginFirebase(req : Request, res: Response){
        try {
            const user_id = (req as any).uid

            const response = await authService.loginFirebase(user_id)

            res.status(response.code).json(response)
            
        } catch (error) {
            res.status(500).json({message: error, data: {}});
        }
    }

    
}

export default new AuthController;