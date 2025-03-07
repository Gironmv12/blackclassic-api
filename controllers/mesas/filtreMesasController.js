import express from 'express';
import { sequelize } from '../../config/database.js';
import { body, validationResult } from 'express-validator';
import MesasModel from '../../models/mesas.js';
import AccesosModel from '../../models/accesos.js';

const mesas = express.Router();

// Inicializar el modelo de mesas y accesos
const Mesa = MesasModel(sequelize);
const Accesos = AccesosModel(sequelize);

// Ruta para obtener mesas filtradas por tipo de acceso  
// Ejemplo de endpoint: GET /api/mesas?tipoAcceso=VIP
mesas.get('/', async (req, res) => {
    const { tipoAcceso } = req.query;
    if (!tipoAcceso) {
        return res.status(400).json({ error: 'El parámetro tipoAcceso es requerido' });
    }
    
    try {
        // Se busca en la tabla de accesos el registro cuyo nombre coincida con el tipoAcceso proporcionado
        const acceso = await Accesos.findOne({ where: { nombre: tipoAcceso } });
        if (!acceso) {
            return res.status(404).json({ error: 'No se encontró el acceso para el tipo especificado' });
        }
        // Se buscan las mesas que tengan idacceso igual al id obtenido en la búsqueda anterior
        const mesasFiltradas = await Mesa.findAll({
            where: { idacceso: acceso.id }
        });
        return res.status(200).json(mesasFiltradas);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener mesas filtradas' });
    }
});

export default mesas;