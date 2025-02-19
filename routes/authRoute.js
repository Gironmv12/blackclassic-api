import express from 'express';
import authController from '../controllers/auth/authController.js';

const router = express.Router();

//definir rutas para el login
router.use('/auth', authController);

export default router;