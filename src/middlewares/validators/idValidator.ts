import type { NextFunction, Request, Response } from 'express'
import { param} from 'express-validator'
import { validateResult } from '../../core/validateResult.js'

export const idValidator = [
    param("id")
    .exists().withMessage("id is required")
    .isUUID().withMessage("id format incorrect")
    .notEmpty().withMessage('id cannot be empty')
    .isString().withMessage('id must be a string'),

    (req:Request, res:Response, next:NextFunction)=> {
        validateResult(req, res, next)
    }
]