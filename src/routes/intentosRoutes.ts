import express from 'express'
import intentosController from '../controllers/intentosController.js'
import { authenticateFirebase } from '../middlewares/authFirebase.js'

const IntentosRoutes = express.Router()

IntentosRoutes.get("/attempts/ranking", authenticateFirebase, intentosController.getRanking)
IntentosRoutes.post("/attempts/create", authenticateFirebase, intentosController.create)


export default IntentosRoutes