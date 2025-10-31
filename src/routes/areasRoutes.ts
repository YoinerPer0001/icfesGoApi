import express from "express"
import areasController from "../controllers/areasController.js"
import { authenticateFirebase } from "../middlewares/authFirebase.js"


const AreasRoutes = express.Router()


AreasRoutes.get("/areas/all", authenticateFirebase, areasController.getAll)

export default AreasRoutes;