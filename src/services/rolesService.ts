import { ApiResponse } from "../core/responseSchedule.js";
import type Roles from "../models/rolesModel.js";
import rolesRepository from "../repository/rolesRepository.js";


class RolesService{

    async getAll() : Promise<ApiResponse<Roles[] | null>>{

        try {
            const result = await rolesRepository.findAll()
            return new ApiResponse(200,"success", result) 
        } catch (error) {
            return new ApiResponse(500,(error as Error).message, null) 
        }
    }
}

export default new RolesService