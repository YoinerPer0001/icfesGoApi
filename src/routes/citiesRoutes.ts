import express from "express";
import citiesController from "../controllers/citiesController.js";
import { authenticateFirebase } from "../middlewares/authFirebase.js";

const CitiesRoutes = express.Router();

// Obtener todas las ciudades
CitiesRoutes.get("/cities/all", authenticateFirebase, citiesController.getAll);

export default CitiesRoutes;
