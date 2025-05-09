import express from 'express';
import { sequelize } from '../../config/database.js';
import { body, validationResult } from 'express-validator';
import initModels from '../../models/init-models.js';

const mesas = express.Router();

const models = initModels(sequelize);
const { mesas: Mesa, accesos: Accesos } = models;

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


//obtener todas las mesas creadas
mesas.get('/all', async (req, res) => {
    try {
        const mesas = await Mesa.findAll();
        return res.status(200).json(mesas);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener las mesas' });
    }
});

mesas.get('/table-data', async (req, res) => {
    try {
      const mesasData = await Mesa.findAll({
        attributes: ['nombre','numeroasientos','estado'],
        include: [{
          model: Accesos,
          as: 'idacceso_acceso',
          attributes: ['nombre']
        }]
      });
      console.log('mesasData:', mesasData);
      return res.status(200).json(mesasData);
    } catch (error) {
      console.error('❌ Error en /table-data:', error);
      return res.status(500).json({
        error: 'Error al obtener los datos de las mesas',
        details: error.message
      });
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

/*
============================
Aqui empieza el flujo del sistema
============================
*/
//obtener mesas ocupadas y reservadas

// Obtener mesas ocupadas y reservadas
mesas.get('/status/ocupadas-reservadas', async (req, res) => {
    try {
        const mesas = await Mesa.findAll({
            where: {
                estado: ['reservada', 'ocupada'] // Filtrar por estados "reservada" y "ocupada"
            }
        });
        return res.status(200).json(mesas);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener las mesas ocupadas y reservadas' });
    }
});

//obtener informacion de una mesa ocupada o reservada
mesas.get('/details/:id', async (req, res) => {
    const { id } = req.params; // ID de la mesa
    try {
        const mesa = await Mesa.findByPk(id, {
            include: [
                {
                    model: Accesos,
                    as: 'idacceso_acceso', // Alias definido en init-models
                    attributes: ['nombre'] // Tipo de acceso
                },
                {
                    model: models.reservas,
                    as: 'reservas', // Alias corregido según init-models.js
                    include: [
                        {
                            model: models.clientes,
                            as: 'idcliente_cliente', // Alias definido en init-models
                            attributes: ['nombre', 'correo', 'telefono'] // Datos del cliente
                        }
                    ]
                }
            ]
        });

        if (!mesa || (mesa.estado !== 'reservada' && mesa.estado !== 'ocupada')) {
            return res.status(404).json({ error: 'Mesa no encontrada o no está reservada/ocupada' });
        }

        return res.status(200).json(mesa);
    } catch (error) {
        console.error('Error al obtener los detalles de la mesa: ', error);
        return res.status(500).json({ error: 'Error al obtener los detalles de la mesa' });
    }
});



export default mesas; 