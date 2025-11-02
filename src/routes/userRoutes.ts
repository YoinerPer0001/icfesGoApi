import express from 'express'
import { authenticateFirebase } from '../middlewares/authFirebase.js';
import userController from '../controllers/userController.js';
import { getTutorValidator } from '../middlewares/validators/userValidator.js';

const UserRoutes = express.Router()

UserRoutes.get('/tutors/all', authenticateFirebase,getTutorValidator,userController.getAllTutors)


export default UserRoutes;