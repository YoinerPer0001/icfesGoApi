import { ApiResponse } from "../core/responseSchedule.js";
import type User from "../models/userModel.js";
import userRepository from "../repository/userRepository.js";

interface ResponseTutor{
    data: User[];
    total: number;
    totalPages: number;
    currentPage: number;
}

class UserService {

    async getAllTutors(page:number, limit:number): Promise<ApiResponse<ResponseTutor | null>> {
        try {
            const response = await userRepository.getTutors(page, limit)
            return new ApiResponse(200, "success", response)
            
        } catch (error) {
            return new ApiResponse(500, (error as Error).message, null);
        }
    }

}

export default new UserService;