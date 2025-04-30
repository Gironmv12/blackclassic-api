import express from 'express';
import { sequelize } from '../../config/database.js';
import initModels from '../../models/init-models.js';
import { body, validationResult } from 'express-validator';

const models = initModels(sequelize);
const { ordenes: Ordenes, detalleorden: DetalleOrden, productos: Productos } = models;

const ordenes = express.Router();

// Agregar producto a la orden
ordenes.post('/add-to-order', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { idOrden, idProducto, cantidad, idReserva, idMesa } = req.body;

        // Validar que el producto exista
        const producto = await Productos.findByPk(idProducto);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        let orden;

        // Si no se proporciona un idOrden, crear una nueva orden
        if (!idOrden) {
            // Validar que la reserva y la mesa existen
            const reserva = await models.reservas.findByPk(idReserva);
            if (!reserva) {
                return res.status(404).json({ error: 'Reserva no encontrada' });
            }

            const mesa = await models.mesas.findByPk(idMesa);
            if (!mesa) {
                return res.status(404).json({ error: 'Mesa no encontrada' });
            }

            // Crear una nueva orden asociada a la reserva y la mesa
            orden = await Ordenes.create({
                estado: 'pendiente',
                fechaorden: new Date(),
                totalorden: 0, // Se actualizará más adelante
                idreserva: idReserva,
                idmesa: idMesa
            }, { transaction: t });
        } else {
            // Buscar la orden existente
            orden = await Ordenes.findByPk(idOrden);
            if (!orden) {
                return res.status(404).json({ error: 'Orden no encontrada' });
            }
        }

        // Verificar si el producto ya está en la orden
        let detalle = await DetalleOrden.findOne({
            where: { idorden: orden.id, idproducto: idProducto }
        });

        if (detalle) {
            // Actualizar la cantidad del producto en la orden
            detalle.cantidad += cantidad;
            detalle.subtotal = detalle.cantidad * producto.preciounitario;
            await detalle.save({ transaction: t });
        } else {
            // Agregar el producto a la orden
            detalle = await DetalleOrden.create({
                idorden: orden.id,
                idproducto: idProducto,
                cantidad,
                preciounitario: producto.preciounitario,
                subtotal: cantidad * producto.preciounitario
            }, { transaction: t });
        }

        // Actualizar el total de la orden
        const detalles = await DetalleOrden.findAll({ where: { idorden: orden.id } });
        const totalOrden = detalles.reduce((total, item) => total + item.subtotal, 0);
        orden.totalorden = totalOrden;
        await orden.save({ transaction: t });

        await t.commit();
        res.status(200).json({ message: 'Producto agregado a la orden', orden, detalle });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'Error al agregar el producto a la orden', details: error.message });
    }
});

ordenes.post('/finalizar-orden', async (req, res) => {
    try {
        const { idOrden } = req.body;
        const orden = await Ordenes.findByPk(idOrden);
        if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });
        
        orden.estado = 'guardada'; // o 'finalizada'
        await orden.save();
        res.status(200).json({ message: 'Orden finalizada', orden });
    } catch (error) {
        res.status(500).json({ error: 'Error al finalizar la orden', details: error.message });
    }
});

// Eliminar o decrementar producto de la orden
ordenes.post('/remove-from-order', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { idOrden, idProducto } = req.body;

        // Buscar la orden
        const orden = await Ordenes.findByPk(idOrden);
        if (!orden) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        // Buscar el detalle del producto en la orden
        const detalle = await DetalleOrden.findOne({
            where: { idorden: idOrden, idproducto: idProducto }
        });

        if (!detalle) {
            return res.status(404).json({ error: 'Producto no encontrado en la orden' });
        }

        // Decrementar la cantidad o eliminar el producto si la cantidad es 1
        if (detalle.cantidad > 1) {
            detalle.cantidad -= 1;
            detalle.subtotal = detalle.cantidad * detalle.preciounitario;
            await detalle.save({ transaction: t });
        } else {
            await detalle.destroy({ transaction: t });
        }

        // Actualizar el total de la orden
        const detalles = await DetalleOrden.findAll({ where: { idorden: idOrden } });
        const totalOrden = detalles.reduce((total, item) => total + item.subtotal, 0);
        orden.totalorden = totalOrden;
        await orden.save({ transaction: t });

        await t.commit();
        res.status(200).json({ message: 'Producto eliminado de la orden', orden });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'Error al eliminar el producto de la orden', details: error.message });
    }
});

ordenes.get('/mesa/:idMesa', async (req, res) => {
    try {
        const { idMesa } = req.params;
        const ordenesMesa = await Ordenes.findAll({
            where: { idmesa: idMesa },
            include: [
                {
                    model: DetalleOrden,
                    as: 'detalleordens',
                    include: [
                        {
                            model: Productos,
                            as: 'idproducto_producto'
                        }
                    ]
                }
            ]
        });

        res.status(200).json(ordenesMesa);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la orden de la mesa', details: error.message });
    }
});

export default ordenes;