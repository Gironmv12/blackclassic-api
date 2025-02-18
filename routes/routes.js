import express from 'express';
import userController from '../controllers/user/userController.js';

const router = express.Router();

//definir rutas para el usuario
router.use('/user', userController);

export default router;