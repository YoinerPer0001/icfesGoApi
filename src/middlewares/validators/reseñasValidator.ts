import type { NextFunction, Request, Response } from "express";
import { body, check, param, query } from "express-validator";
import { validateResult } from "../../core/validateResult.js";

export const ReviewsCreateValidator = [
  body("tutor_id")
    .notEmpty().withMessage("tutor_id is required")
    .isUUID().withMessage("tutor_id must be a valid id"),

  body("rating")
    .notEmpty().withMessage("rating is required")
    .isNumeric().withMessage("rating  must be a number"),

  body("text")
    .notEmpty().withMessage("text is required")
    .isString().withMessage("text must be a valid string"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];