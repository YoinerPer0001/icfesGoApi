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


export const createTutorDataValidator = [
  // Validación de dataUser
  body("dataUser")
    .exists().withMessage("dataUser is required")
    .isObject().withMessage("dataUser must be an object"),

  body("dataUser.city_id")
    .exists().withMessage("city_id is required")
    .isUUID().withMessage("city_id must be a valid UUID"),

  // Validación de dataTutor
  body("dataTutor")
    .exists().withMessage("dataTutor is required")
    .isObject().withMessage("dataTutor must be an object"),

  body("dataTutor.sobre_mi")
    .exists().withMessage("sobre_mi is required")
    .isString().withMessage("sobre_mi must be a string")
    .notEmpty().withMessage("sobre_mi cannot be empty"),

  body("dataTutor.biografia")
    .exists().withMessage("biografia is required")
    .isString().withMessage("biografia must be a string")
    .notEmpty().withMessage("biografia cannot be empty"),

  body("dataTutor.precio_hora")
    .exists().withMessage("precio_hora is required")
    .isFloat().withMessage("precio_hora must be a valid float"),

  body("dataTutor.sesiones_type")
    .exists().withMessage("sesiones_type is required")
    .isString().withMessage("sesiones_type must be a string")
    .isIn(["presenciales", "virtuales", "mixtas"]).withMessage("sesiones_type must be one of: presenciales, virtuales, mixtas"),

  // Validación de certificates
  body("certificates")
    .exists().withMessage("certificates is required")
    .isArray({ min: 1 }).withMessage("certificates must be an array with at least one element"),

  body("certificates.*.url_resource")
    .exists().withMessage("url_resource is required")
    .isURL().withMessage("url_resource must be a valid URL"),

  body("certificates.*.name")
    .exists().withMessage("name is required")
    .isString().withMessage("name must be a valid string"),

  // Validación de listAreas
  body("listAreas")
    .exists().withMessage("listAreas is required")
    .isArray({ min: 1 }).withMessage("listAreas must be an array with at least one element"),

  body("listAreas.*.id_area")
    .exists().withMessage("id_area is required")
    .isUUID().withMessage("id_area must be a valid UUID"),

  // Finaliza con el middleware de validación
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];
