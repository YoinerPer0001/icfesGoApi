import { body } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { validateResult } from "../../core/validateResult.js";


export const createStudentDataValidator = [

  body("dataUser")
    .exists().withMessage("dataUser is required")
    .isObject().withMessage("dataUser must be an object"),

  body("dataUser.city_id")
    .exists().withMessage("city_id is required")
    .isUUID().withMessage("city_id must be a valid UUID"),


  body("dataStudent")
    .exists().withMessage("dataStudent is required")
    .isObject().withMessage("dataStudent must be an object"),

  body("dataStudent.id_grado")
    .exists().withMessage("id_grado is required")
    .isUUID().withMessage("id_grado must be a valid UUID"),

  body("dataStudent.test_type_id")
    .exists().withMessage("test_type_id is required")
    .isUUID().withMessage("test_type_id must be a valid UUID"),


  body("listAreas")
    .exists().withMessage("listAreas is required")
    .isArray({ min: 1 }).withMessage("listAreas must be an array with at least one element"),

  body("listAreas.*.id_area")
    .exists().withMessage("id_area is required")
    .isUUID().withMessage("id_area must be a valid UUID"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];
