import express from 'express';
import accesosController from '../controllers/accesos/accesosController.js';

const router = express.Router();

//definir rutas para los accesos
router.use('/accesos', accesosController);

export default router;