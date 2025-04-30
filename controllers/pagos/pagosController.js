import express from 'express';
import { sequelize } from '../../config/database.js';
import initModels from '../../models/init-models.js';
import { body, validationResult } from 'express-validator';

const models = initModels(sequelize);
const {
    pagos: Pagos,
    ordenes: Ordenes,
    detalleorden: DetalleOrden,
    reservas: Reservas,
    mesas: Mesas,
} = models;

const pagos = express.Router();

//registrar un pago
pagos.post('/registrar-pago', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { idOrden, metodopago } = req.body;

        // 1. Obtener la orden y la mesa asociada
        const orden = await models.ordenes.findByPk(idOrden, { transaction: t });
        if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });
        const mesa = await models.mesas.findByPk(orden.idmesa, { transaction: t });
        if (!mesa) return res.status(404).json({ error: 'Mesa no encontrada' });

        // 2. Calcular total (podrías añadir IVA si quieres)
        //    En este ejemplo asumimos que la orden ya tiene el total calculado
        const totalOrden = orden.totalorden;

        // 3. Registrar el pago
        const pago = await models.pagos.create({
            idorden: orden.id,
            idreserva: orden.idreserva,
            montopagado: totalOrden,
            metodopago, // 'efectivo' o 'tarjeta'
            fechapago: new Date()
        }, { transaction: t });

        // 4. Cambiar la orden de 'guardada' a 'pagada'
        orden.estado = 'pagada';
        await orden.save({ transaction: t });

        // 5. Liberar la mesa
        mesa.estado = 'disponible';
        await mesa.save({ transaction: t });

        await t.commit();
        res.status(200).json({ message: 'Pago registrado', pago, orden, mesa });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'Error al registrar el pago', details: error.message });
    }
});

export default pagos;