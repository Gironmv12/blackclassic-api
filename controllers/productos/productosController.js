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

//obtener todos los productos
productos.get('/', async (req, res) => {
    try {
        const allProducts = await Productos.findAll();
        res.status(200).json(allProducts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos', details: error.message });
    }
});

//eliminar un prudcuto
productos.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Productos.findByPk(id);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        await product.destroy();
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
    }

});

//datoos del producto
productos.get('/datos/listado', async (req, res) => {
    try {
        const productsData = await Productos.findAll({
            attributes: ['id', 'nombre', 'preciounitario', 'estado'],
            include: [
                {
                    model: initModels(sequelize).categorias, 
                    as: 'categoria',
                    attributes: ['nombre']
                }
            ]
        });
        res.status(200).json(productsData);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos de productos', details: error.message });
    }
});

//enpoit para actualizar un producto
productos.put('/update/:id', 
    upload.single('nuevaImagen'), // Cambiado el nombre del campo
    [
        body('nombre').notEmpty().withMessage('Nombre es requerido'),
        body('categoria_id').isInt({ gt: 0 }).withMessage('categoria_id debe ser entero positivo'),
        body('preciounitario').isDecimal().withMessage('Precio unitario debe ser un número decimal'),
        body('estado').isIn(['disponible', 'agotado', 'promoción']).withMessage('Estado no válido')
    ], 
    async (req, res) => {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const product = await Productos.findByPk(id);
            if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
            const { nombre, categoria_id, preciounitario, estado, descripcion } = req.body;
            await product.update({
                nombre,
                categoria_id,
                preciounitario,
                estado,
                imagen: req.file ? req.file.path : product.imagen,
                descripcion: descripcion || null
            });
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
        }
});

export default productos;