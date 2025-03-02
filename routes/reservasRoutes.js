import express from 'express';
import reservasController from '../controllers/reservation/reservasController.js';

const router = express.Router();

//definir la ruta para las reservas
router.use('/reservas', reservasController);

export default router;