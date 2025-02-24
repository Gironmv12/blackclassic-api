import express from 'express';
import { sequelize } from '../../config/database.js';
import { body, validationResult } from 'express-validator';
import MesasModel from '../../models/mesas.js';
import AccesosModel from '../../models/accesos.js';

const mesas = express.Router();

// Inicializar el modelo de mesas
const Mesa = MesasModel(sequelize);
const Accesos = AccesosModel(sequelize);

//crear una mesa
mesas.post('/create', [
    body('nombre').notEmpty().withMessage('Nombre es requerido'),
    body('idacceso').isInt({ gt: 0 }).withMessage('idacceso debe ser entero positivo'),
    body('numeroasientos').isInt({ gt: 0 }).withMessage('Número de asientos debe ser entero positivo'),
    // body('estado') es opcional
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { nombre, idacceso, numeroasientos, estado } = req.body;
        // Verificar que el acceso existe
        const accesoExists = await Accesos.findByPk(idacceso);
        if (!accesoExists) {
            return res.status(400).json({ error: 'Acceso no encontrado' });
        }
        // Crear la mesa
        const newMesa = await Mesa.create({
            nombre,
            idacceso,
            numeroasientos,
            estado: estado ? estado : 'disponible'
        });
        return res.status(201).json(newMesa);
    } catch (error) {
        return res.status(500).json({ error: 'Error al crear la mesa' });
    }
});

export default mesas;