import express from 'express';
import ordenesController from '../controllers/ordenes/ordenesController.js';

const router = express.Router();

//definir rutas para las ordenes
router.use('/ordenes', ordenesController);

export default router;