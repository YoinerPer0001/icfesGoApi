import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ApiResponse } from "./responseSchedule.js";


export const validateResult = (req:Request, res:Response, next:NextFunction) => {

    try {
        validationResult(req).throw()
        return next()
    } catch (error) {
        const validateErrors = (error as any).errors ?? [];
        res.status(400).json(new ApiResponse(400, validateErrors, {}))
    }
}