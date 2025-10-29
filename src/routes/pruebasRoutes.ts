import express from "express";
import pruebasController from "../controllers/pruebasController.js";
import { authenticateFirebase } from "../middlewares/authFirebase.js";

const PruebasRoutes = express.Router();

// Obtener todas las pruebas
PruebasRoutes.get("/pruebas/all", pruebasController.getAll);

export default PruebasRoutes;
