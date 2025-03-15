import express from 'express';
import { sequelize } from '../../config/database.js';
import initModels from '../../models/init-models.js';

const models = initModels(sequelize);
const { mesas: Mesa, accesos: Acceso } = models;

const mesas = express.Router();

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
        
        // Mapear para retornar los datos requeridos: título, capacidad, acceso, estado y horainicio.
        const mesasResponse = mesasFiltradas.map((mesa) => {
            return {
                id: mesa.id,
                titulo: mesa.nombre,
                capacidad: mesa.numeroasientos,
                acceso: tipoAcceso,
                estado: mesa.estado,                    // Estado actual de la mesa
                horainicio: mesa.horainicio              // Horario preestablecido en la mesa
            };
        });
        return res.status(200).json(mesasResponse);
    } catch (error) {
        console.error('Error al obtener mesas filtradas: ', error);
        return res.status(500).json({ error: 'Error al obtener mesas filtradas' });
    }
});

export default mesas;