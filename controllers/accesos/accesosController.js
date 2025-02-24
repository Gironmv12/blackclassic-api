import express from 'express';
import { sequelize } from '../../config/database.js';
import { body, validationResult } from 'express-validator';
import accesosModel from '../../models/accesos.js'; // Importación por defecto

const router = express.Router();

// Inicializar el modelo de accesos con un nombre distinto para evitar conflictos
const Acceso = accesosModel(sequelize);

//crear un acceso
router.post('/create', [
    //validar nombre, precio, descripcion
    body('nombre').notEmpty().withMessage('Nombre es requerido'),
    body('precio').isDecimal().withMessage('Precio debe ser decimal'),
    body('descripcion').optional(),
], async (req, res) => {
    //validar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //crear un nuevo acceso
        const { nombre, precio, descripcion } = req.body;
        const newAcceso = await Acceso.create({
            nombre,
            precio,
            descripcion
        });
        return res.status(201).json(newAcceso);
    } catch (error) {
        return res.status(500).json({ error: 'Error al crear el acceso' });
    }
});

//obtener todos los accesos
router.get('/all', async (req, res) => {
    try {
        const accesos = await Acceso.findAll();
        return res.status(200).json(accesos);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener los accesos' });
    }
});

//obtener un acceso por id
router.get('/:id', async (req, res) => {
    try {
        const acceso = await Acceso.findByPk(req.params.id);
        if (acceso) {
            return res.status(200).json(acceso);
        } else {
            return res.status(404).json({ error: 'Acceso no encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener el acceso' });
    }
});

//actualizar un acceso
router.put('/update/:id', [
    //validar nombre, precio, descripcion
    body('nombre').notEmpty().withMessage('Nombre es requerido'),
    body('precio').isDecimal().withMessage('Precio debe ser decimal'),
    body('descripcion').optional(),
], async (req, res) => {
    //validar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //actualizar un acceso
        const { nombre, precio, descripcion } = req.body;
        const acceso = await Acceso.findByPk(req.params.id);
        if (acceso) {
            acceso.nombre = nombre;
            acceso.precio = precio;
            acceso.descripcion = descripcion;
            await acceso.save();
            return res.status(200).json(acceso);
        } else {
            return res.status(404).json({ error: 'Acceso no encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al actualizar el acceso' });
    }
});

//eliminar un acceso
router.delete('/delete/:id', async (req, res) => {
    try {
        //eliminar un acceso
        const acceso = await Acceso.findByPk(req.params.id);
        if (acceso) {
            await acceso.destroy();
            return res.status(200).json({ message: 'Acceso eliminado correctamente' });
        } else {
            return res.status(404).json({ error: 'Acceso no encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar el acceso' });
    }
});

export default router;