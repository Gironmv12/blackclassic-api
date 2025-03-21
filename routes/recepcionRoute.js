import express from 'express';
import validarReservaController from '../controllers/recepcion/validarReservaController.js';

const router = express.Router();

//definir la ruta para validar reservas
router.use('/recepcion', validarReservaController);

export default router;