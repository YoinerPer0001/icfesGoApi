import express from 'express'
import { authenticateFirebase } from '../middlewares/authFirebase.js';
import userController from '../controllers/userController.js';
import { getTutorValidator } from '../middlewares/validators/userValidator.js';

const UserRoutes = express.Router()

UserRoutes.get('/tutors/all', authenticateFirebase,getTutorValidator,userController.getAllTutors)
UserRoutes.get('/student/info', authenticateFirebase,userController.getStudentInfo)
UserRoutes.get('/tutor/info', authenticateFirebase,userController.getTutorInfo)

export default UserRoutes;