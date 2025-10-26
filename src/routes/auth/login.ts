import express from 'express';
import AuthController from '../../controllers/AuthController.js';
import { authenticateFirebase } from '../../middlewares/authFirebase.js';
import { loginNoFirebaseValidator } from '../../middlewares/validators/userValidator.js';

const authRouter = express.Router();

authRouter.post('/login', loginNoFirebaseValidator, AuthController.login);
authRouter.get('/login', authenticateFirebase, AuthController.loginFirebase)
  

export default authRouter;