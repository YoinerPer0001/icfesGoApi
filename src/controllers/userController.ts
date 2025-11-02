import type { Response , Request} from "express";
import userRepository from "../repository/userRepository.js";
import { ApiResponse } from "../core/responseSchedule.js";
import userService from "../services/userService.js";

class UserController {
    async getAllTutors(req:Request, res:Response){
       try {
            const {page,limit} = req.params;
            const response = await userService.getAllTutors(parseInt(page ?? "1"), parseInt(limit ?? "10"))
            res.status(response.code).json(response)
       } catch (error) {
            res.status(500).json({ message: error, data: {} });
       }
    }
}

export default new UserController;