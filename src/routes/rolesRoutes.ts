import express from 'express'
import rolesController from '../controllers/rolesController.js'
import { authenticateFirebase } from '../middlewares/authFirebase.js'


const RolesRoutes = express.Router()

RolesRoutes.get('/roles/all', rolesController.getAll)



export default RolesRoutes