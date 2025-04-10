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

//obtener mesas por idacceso
/*mesas.get('/available/:idacceso', async (req, res) => {
    const { idacceso } = req.params;
    try {
        // Verificar que el acceso exista
        const accesoExists = await Accesos.findByPk(idacceso);
        if (!accesoExists) {
            return res.status(400).json({ error: 'Acceso no encontrado' });
        }
        
        // Buscar mesas asociadas a este acceso y que estén disponibles
        const mesasDisponibles = await Mesa.findAll({
            where: {
                idacceso: idacceso,
                estado: 'disponible'
            }
        });
        
        // Procesar cada mesa agregando la info de interfaz (horarios disponibles y, opcionalmente, slots)
        const mesasCards = mesasDisponibles.map(mesa => ({
            id: mesa.id,
            nombre: mesa.nombre,
            capacidad: mesa.numeroasientos,
            horariosDisponibles: "Disponible a partir de las 6:00 PM",
            estado: mesa.estado,
            // slots/reservas: aquí podrías agregar lógica adicional según las reservas actuales o tiempos de limpieza
        }));
        
        return res.status(200).json(mesasCards);
        
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener mesas disponibles' });
    }
});*/

//obtener todas las mesas creadas
mesas.get('/all', async (req, res) => {
    try {
        const mesas = await Mesa.findAll();
        return res.status(200).json(mesas);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener las mesas' });
    }
});

//obtener una mesa por id
mesas.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const mesa = await Mesa.findByPk(id);
        if (!mesa) {
            return res.status(404).json({ error: 'Mesa no encontrada' });
        }
        return res.status(200).json(mesa);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener la mesa' });
    }
});

//actualizar una mesa
mesas.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const mesa = await Mesa.findByPk(id);
        if (!mesa) {
            return res.status(404).json({ error: 'Mesa no encontrada' });
        }
        const { nombre, idacceso, numeroasientos, estado } = req.body;
        // Verificar que el acceso existe
        if (idacceso) {
            const accesoExists = await Accesos.findByPk(idacceso);
            if (!accesoExists) {
                return res.status(400).json({ error: 'Acceso no encontrado' });
            }
        }
        // Actualizar la mesa
        await mesa.update({
            nombre,
            idacceso,
            numeroasientos,
            estado
        });
        return res.status(200).json(mesa);
    } catch (error) {
        return res.status(500).json({ error: 'Error al actualizar la mesa' });
    }
});

//eliminar una mesa
mesas.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const mesa = await Mesa.findByPk(id);
        if (!mesa) {
            return res.status(404).json({ error: 'Mesa no encontrada' });
        }
        await mesa.destroy();
        return res.status(200).json({ message: 'Mesa eliminada' });
    } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar la mesa' });
    }
});

export default mesas; 