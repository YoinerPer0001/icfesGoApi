import type { NextFunction, Request, Response } from "express";
import { body, check, param } from "express-validator";
import { validateResult } from "../../core/validateResult.js";

export const updateUserValidator = [
  body().custom((value, { req }) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("At least one parameter must be provided");
    }
    return true;
  }),
  body("attempts_remaining")
    .optional()
    .isInt()
    .withMessage("attempts_remaining must be an integer")
    .notEmpty()
    .withMessage("attempts_remaining cannot be empty if provided"),

  body("last_attempt_reset")
    .not()
    .exists()
    .withMessage("last_attempt_reset cannot be sent in this request"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export const updateUserSucriptionValidator = [
  body("isPremium")
    .isBoolean()
    .notEmpty(),

  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];

export const loginNoFirebaseValidator = [
  body("email")
  .isEmail()
  .notEmpty()
  .isString(),
  
  body("password")
  .notEmpty()
  .isString(),

  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  }
];

