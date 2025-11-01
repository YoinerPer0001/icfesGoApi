import express from 'express';
import AuthController from '../../controllers/AuthController.js';
import { authenticateFirebase } from '../../middlewares/authFirebase.js';
import { loginNoFirebaseValidator, userCreateValidator } from '../../middlewares/validators/userValidator.js';
import { createStudentDataValidator, createTutorDataValidator } from '../../middlewares/validators/authValidators.js';

const authRouter = express.Router();

authRouter.post('/login', loginNoFirebaseValidator, AuthController.login);
authRouter.get('/login', authenticateFirebase, AuthController.loginFirebase)
authRouter.post('/register', authenticateFirebase, userCreateValidator, AuthController.register)
authRouter.post('/auth', authenticateFirebase, AuthController.signImageKit)
authRouter.put("/auth/student/update",  authenticateFirebase, createStudentDataValidator, AuthController.updateStudentInfo)
authRouter.put("/auth/tutor/update",  authenticateFirebase, createTutorDataValidator, AuthController.updateTutorInfo)
  

export default authRouter;