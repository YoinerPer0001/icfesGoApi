import express from "express";
import gradosController from "../controllers/gradosController.js";
import { authenticateFirebase } from "../middlewares/authFirebase.js";

const GradosRoutes = express.Router();

// Obtener todos los grados
GradosRoutes.get("/grados/all", gradosController.getAll);

export default GradosRoutes;
