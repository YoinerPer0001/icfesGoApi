import express from 'express';
import reseñasController from '../controllers/reseñasController.js';
import { authenticateFirebase } from '../middlewares/authFirebase.js';
import { ReviewsCreateValidator } from '../middlewares/validators/reseñasValidator.js';

const ReseñasRoutes = express.Router();

ReseñasRoutes.post('/reviews/create-or-update', authenticateFirebase, ReviewsCreateValidator, reseñasController.createOrUpdate )

export default ReseñasRoutes;