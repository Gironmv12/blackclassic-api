import express from 'express';
import mesasController from '../controllers/mesas/mesasController.js';

const router = express.Router();

//defibir la ruta para las mesas
router.use('/mesas', mesasController);

export default router;