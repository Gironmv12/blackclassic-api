import express from 'express';
import { sequelize } from '../../config/database.js';
import initModels from '../../models/init-models.js';
import { body, validationResult } from 'express-validator';

const models = initModels(sequelize);
const { reservas: Reserva, mesas: Mesa } = models;

const recepcion = express.Router();

// Validar la reserva mediante el código QR
recepcion.post('/validateReserva', [
    body('codigoqr').notEmpty().withMessage('El código QR es requerido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { codigoqr } = req.body;
    try {
        // Buscar la reserva relacionada con el código QR
        const reserva = await Reserva.findOne({ where: { codigoqr } });
        if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

        //Verificar si la reserva ya fue validada, 
        // por ejemplo, puedes agregar un campo 'validada' en el modelo Reserva
        if (reserva.validada) return res.status(400).json({ error: 'Reserva ya validada' });

        // Actualizar el estado de la mesa asociada a la reserva a "ocupada"
        const mesa = await Mesa.findByPk(reserva.idmesa);
        if (!mesa) return res.status(404).json({ error: 'Mesa no encontrada' });
        mesa.estado = 'ocupada';
        await mesa.save();

        // Actualizar la reserva para indicar que ya fue validada
        reserva.validada = true;
        await reserva.save();

        return res.status(200).json({ message: 'Reserva validada correctamente, mesa ocupada' });

    } catch (error) {
        console.error('Error al validar la reserva:', error);
        return res.status(500).json({ error: 'Error al validar la reserva' });
    }
});

export default recepcion;