import express from 'express';
import { Op } from 'sequelize';
import { sequelize } from '../../config/database.js';
import initModels from '../../models/init-models.js';

const models = initModels(sequelize);
const { mesas: Mesa, reservas: Reserva } = models;

const reservas = express.Router();

// Endpoint para iniciar la reserva (cambiar de "reservada" a "ocupada" y registrar el horario de inicio oficial)
reservas.put('/start/:id', async (req, res) => {
    try {
        const reservaId = req.params.id;
        const reserva = await Reserva.findByPk(reservaId);
        if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

        // Se supone que la mesa ya está reservada
        const mesa = await Mesa.findByPk(reserva.idmesa);
        if (!mesa) return res.status(404).json({ error: 'Mesa no encontrada' });

        // Actualizar estado a "ocupada" y registrar el horario de inicio
        reserva.horainicio = new Date();
        mesa.estado = 'ocupada';

        await reserva.save();
        await mesa.save();

        return res.status(200).json({ message: 'Reserva iniciada, mesa ocupada', reserva });
    } catch (error) {
        return res.status(500).json({ error: 'Error al iniciar la reserva' });
    }
});

// Endpoint para finalizar la reserva (cambiar de "ocupada" a "disponible" y registrar el horario de fin)
reservas.put('/finish/:id', async (req, res) => {
    try {
        const reservaId = req.params.id;
        const reserva = await Reserva.findByPk(reservaId);
        if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

        const mesa = await Mesa.findByPk(reserva.idmesa);
        if (!mesa) return res.status(404).json({ error: 'Mesa no encontrada' });

        // Registrar el horario de fin y calcular el nuevo horario disponible (15 minutos de margen)
        const ahora = new Date();
        reserva.horafin = ahora;

        const margenLimpieza = 15 * 60 * 1000; // 15 minutos en milisegundos
        const nuevoHorarioDisponible = new Date(ahora.getTime() + margenLimpieza);

        // Actualizar el estado de la mesa a "disponible"
        mesa.estado = 'disponible';

        await reserva.save();
        await mesa.save();

        return res.status(200).json({ 
            message: 'Reserva finalizada, mesa disponible nuevamente', 
            reserva,
            nuevoHorarioDisponible 
        });
    } catch (error) {
        return res.status(500).json({ error: 'Error al finalizar la reserva' });
    }
});

export default reservas;