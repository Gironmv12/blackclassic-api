import express from 'express';
import { Op } from 'sequelize';
import { sequelize } from '../../config/database.js';
import MesasModel from '../../models/mesas.js';
import AccesosModel from '../../models/accesos.js';
import initModels from '../../models/init-models.js';

const models = initModels(sequelize);
const { mesas: Mesa, accesos: Acceso, reservas: Reserva } = models;

const mesas = express.Router();

/*
  Endpoint modificado para recibir únicamente el parámetro:
  - tipoAcceso: para filtrar las mesas de acuerdo al acceso
  
  Se determinará la disponibilidad en base a si, en el horario actual,
  existe alguna reserva para esa mesa (usando los campos horainicio y horafin).
*/
mesas.get('/', async (req, res) => {
    const { tipoAcceso } = req.query;
    if (!tipoAcceso) {
        return res.status(400).json({ error: 'El parámetro tipoAcceso es requerido' });
    }
    try {
        // Buscar el acceso según el tipo dado
        const acceso = await Acceso.findOne({ where: { nombre: tipoAcceso } });
        if (!acceso) {
            return res.status(404).json({ error: 'No se encontró el acceso para el tipo especificado' });
        }
        // Buscar mesas asociadas a este acceso
        const mesasFiltradas = await Mesa.findAll({
            where: { idacceso: acceso.id }
        });
        
        // Tomamos la fecha y hora actual para determinar la reserva activa
        const now = new Date();
        
        const mesasConDisponibilidad = await Promise.all(
            mesasFiltradas.map(async (mesa) => {
                // Buscar si existe una reserva activa para la mesa en el momento actual
                const reservaActiva = await Reserva.findOne({
                    where: {
                        idmesa: mesa.id,
                        horainicio: { [Op.lte]: now },
                        horafin: { [Op.gte]: now }
                    },
                    order: [['horainicio', 'ASC']]
                });
                return {
                    id: mesa.id,
                    titulo: mesa.nombre,
                    capacidad: mesa.numeroasientos,
                    acceso: tipoAcceso,
                    disponibilidad: reservaActiva ? "Reservada" : "Disponible",
                    // Si existe reserva, se muestra la hora de inicio de la reserva, de lo contrario se define un valor por defecto
                    horainicio: reservaActiva ? reservaActiva.horainicio : "18:00:00"
                };
            })
        );
        return res.status(200).json(mesasConDisponibilidad);
    } catch (error) {
        console.error('Error al obtener mesas filtradas: ', error);
        return res.status(500).json({ error: 'Error al obtener mesas filtradas' });
    }
});

export default mesas;