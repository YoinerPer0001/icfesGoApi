import express from "express"
import simulacrosController from "../controllers/simulacrosController.js"
import { authenticateFirebase } from "../middlewares/authFirebase.js"

const SimulacrosRoutes = express.Router()

SimulacrosRoutes.get("/simulacros/user", authenticateFirebase, simulacrosController.getByCreator)
SimulacrosRoutes.get("/simulacros/publics", authenticateFirebase, simulacrosController.getPublic)
SimulacrosRoutes.post("/simulacros/create", authenticateFirebase, simulacrosController.create)
SimulacrosRoutes.delete("/simulacro/delete", authenticateFirebase, simulacrosController.delete)

export default SimulacrosRoutes