import express from 'express';
import { sequelize } from '../../config/database.js';
import initModels from '../../models/init-models.js';
import { body, validationResult } from 'express-validator';
import upload from '../../utils/multerConfig.js';

const models = initModels(sequelize);
const { productos: Productos } = models;

const productos = express.Router();

// Crear un nuevo producto
productos.post('/create', 
    upload.single('imagen'), // Middleware para procesar la imagen
    [
        body('nombre').notEmpty().withMessage('Nombre es requerido'),
        body('categoria_id').isInt({ gt: 0 }).withMessage('categoria_id debe ser entero positivo'),
        body('preciounitario').isDecimal().withMessage('Precio unitario debe ser un número decimal'),
        body('estado').isIn(['disponible', 'agotado', 'promoción']).withMessage('Estado no válido')
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { nombre, categoria_id, preciounitario, estado, descripcion } = req.body;
            const newProduct = await Productos.create({
                nombre,
                categoria_id,
                preciounitario,
                estado,
                imagen: req.file ? req.file.path : null,
                descripcion: descripcion || null
            });
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el producto', details: error.message });
        }
});

export default productos;