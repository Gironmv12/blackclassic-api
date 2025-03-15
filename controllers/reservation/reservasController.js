import express from 'express';
import { sequelize } from '../../config/database.js';
import initModels from '../../models/init-models.js';
import { body, validationResult } from 'express-validator';
import { sendEmail } from '../../utils/NodeMailer.js';
import QRCode from 'qrcode';

const models = initModels(sequelize);
const { mesas: Mesa, clientes: Cliente, reservas: Reserva, accesos: Acceso } = models;

const reservas = express.Router();

//crear una reserva que reciva los datos del formulario 
/*
- Crear una reserva (endpoint POST) que reciba los datos del formulario (datos del cliente, id de la mesa, fecha, horas de inicio y fin, etc).
  - Verificar que la mesa esté disponible y, de ser así, actualizar su estado (por ejemplo, de "disponible" a "reservado").
  - Generar el código QR (se puede integrar una librería para esto) y asociarlo a la reserva.
  - Retornar la información de la reserva para mostrar en la página de confirmación.
Función: Recibe los datos del formulario (incluyendo id de la mesa, fecha, horarios, datos del cliente y detalles de la reserva), valida que la mesa seleccionada esté libre, crea (o asocia) el cliente y genera una reserva.
*/

reservas.post('/create', [
    body('idmesa').isInt({ gt: 0 }).withMessage('id mesa debe ser entero positivo'),
    body('nombre').notEmpty().withMessage('Nombre es requerido'),
    body('correo').isEmail().withMessage('Correo debe ser un email válido'),
    body('telefono').optional().isString()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const t = await sequelize.transaction();
    try {
        const { idmesa, idcliente, nombre, correo, telefono } = req.body;
        const mesa = await Mesa.findByPk(idmesa);
        if (!mesa || mesa.estado !== 'disponible') {
            await t.rollback();
            return res.status(400).json({ error: 'Mesa no disponible' });
        }
        let cliente = idcliente ? await Cliente.findByPk(idcliente) : null;
        if (!cliente) {
            cliente = await Cliente.create({ nombre, correo, telefono }, { transaction: t });
        }
        // Se obtiene la hora de inicio preestablecida en la mesa.
        const reservaHorainicio = mesa.horainicio;
        const duracionReserva = 2 * 60 * 60 * 1000; // 2 horas en milisegundos
        const reservaHorafin = new Date(new Date(reservaHorainicio).getTime() + duracionReserva);
        
        // Se genera un código QR único para la reserva.
        const qrData = `reserva-${cliente.id}-${idmesa}-${Date.now()}`;
        const nuevaReserva = await Reserva.create({
            idmesa,
            idcliente: cliente.id,
            // No se envía fecha; se asigna automáticamente por defaultValue en el modelo
            horainicio: reservaHorainicio,
            horafin: reservaHorafin,
            codigoqr: qrData,
        }, { transaction: t });
        // Actualizar el estado de la mesa a "reservada"
        mesa.estado = 'reservada';
        await mesa.save({ transaction: t });
        
        // Commit de la transacción antes de enviar el correo
        await t.commit();
        
        // Generar el QR en formato DataURL
        const qrImageDataURL = await QRCode.toDataURL(nuevaReserva.codigoqr);

        // Enviar correo de confirmación
        try {
            await sendEmail(
                cliente.correo,
                'Reserva Confirmada',
                `<p>Hola ${cliente.nombre},</p>
                 <p>Su reserva ha sido confirmada. Puede utilizar el siguiente QR para acceder:</p>
                 <p><img src="cid:qrCode"/></p>
                 <p>Gracias por preferirnos.</p>`,
                [
                    {
                        filename: 'qr.png',
                        content: Buffer.from(qrImageDataURL.split(',')[1], 'base64'),
                        cid: 'qrCode'
                    }
                ]
            );
        } catch (emailError) {
            console.error('Error al enviar el correo, pero la reserva ya se confirmó: ', emailError);
        }
        return res.status(201).json(nuevaReserva);
    } catch (error) {
        console.error('Error al crear la reserva: ', error);
        try {
            await t.rollback();
        } catch (rollbackError) {
            console.error('Error al hacer rollback: ', rollbackError);
        }
        return res.status(500).json({ error: 'Error al crear la reserva' });
    }
});

// Nuevo endpoint para regenerar el QR sobre demanda a partir de la referencia almacenada
reservas.get('/qr/:id', async (req, res) => {
    try {
        const reservaId = req.params.id;
        const reserva = await Reserva.findByPk(reservaId);
        if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

        // Generar la imagen QR usando la cadena de referencia almacenada
        const qrImageDataURL = await QRCode.toDataURL(reserva.codigoqr);

        // Enviar el QR en formato DataURL (también se puede enviar en formato PNG si se configura)
        return res.status(200).json({ qr: qrImageDataURL });
    } catch (error) {
        return res.status(500).json({ error: 'Error al generar el QR' });
    }
});

//eliminar una reserva
reservas.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction();
    try {
        const reserva = await Reserva.findByPk(id);
        if (!reserva) {
            await t.rollback();
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        
        // Cambiar el estado de la mesa a 'disponible'
        const mesa = await Mesa.findByPk(reserva.idmesa);
        if (mesa) {
            mesa.estado = 'disponible';
            await mesa.save({ transaction: t });
        }
        
        // Eliminar la reserva
        await reserva.destroy({ transaction: t });
        
        // Obtener y eliminar el cliente vinculado a la reserva
        const cliente = await Cliente.findByPk(reserva.idcliente);
        if (cliente) {
            await cliente.destroy({ transaction: t });
        }
        
        await t.commit();
        return res.status(200).json({ message: 'Reserva y cliente eliminados correctamente' });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ error: 'Error al eliminar la reserva' });
    }
});

//obtener detalles de la reserva como fecha, numerodeasientos, idcliente, horario inicio, numero de reserva(codigoqr)
reservas.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const reserva = await Reserva.findByPk(id, {
            include: [
                {
                    model: Mesa,
                    as: "idmesa_mesa", // alias definido en init-models
                    attributes: ['numeroasientos']
                },
                {
                    model: Cliente,
                    as: "idcliente_cliente", // alias definido en init-models
                    attributes: ['nombre', 'correo', 'telefono']
                }
            ]
        });
        if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

        return res.status(200).json(reserva);
    } catch (error) {
        console.error("Error al obtener la reserva: ", error);
        return res.status(500).json({ error: 'Error al obtener la reserva' });
    }
});

//obtener todas las reservas
reservas.get('/', async (req, res) => {
    try {
        const reservas = await Reserva.findAll({
            include: [
                {
                    model: Mesa,
                    as: "idmesa_mesa",
                    attributes: ['numeroasientos']
                },
                {
                    model: Cliente,
                    as: "idcliente_cliente",
                    attributes: ['nombre', 'correo', 'telefono']
                }
            ]
        });
        return res.status(200).json(reservas);
    } catch (error) {
        console.error("Error al obtener las reservas: ", error);
        return res.status(500).json({ error: 'Error al obtener las reservas' });
    }
});

export default reservas;