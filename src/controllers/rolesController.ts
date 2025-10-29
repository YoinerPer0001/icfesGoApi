import type { Request, Response } from "express";
import rolesService from "../services/rolesService.js";


class RolesController {
    async getAll(req:Request, res:Response){
        try {

            const response = await rolesService.getAll()
            res.status(response.code).json(response)
            
        } catch (error) {
            res.status(500).json({ message: error, data: {} })
        }
    }
}

export default new RolesController;