import express from 'express';
import categoriasController from '../controllers/productos/categorias/categoriasController.js';

const router = express.Router();

//definir rutas para las categorias
router.use('/categorias', categoriasController);

export default router;