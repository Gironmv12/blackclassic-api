import express from 'express';
import productosController from '../controllers/productos/productosController.js';

const router = express.Router();

//definir rutas para los productos
router.use('/productos', productosController);

export default router;