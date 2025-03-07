import express from 'express';
import mesasController from '../controllers/mesas/mesasController.js';
import filterMesasController from '../controllers/mesas/filtreMesasController.js';

const router = express.Router();

//defibir la ruta para las mesas
router.use('/mesas', mesasController);
//definir la ruta para filtrar mesas
router.use('/mesas', filterMesasController);

export default router;