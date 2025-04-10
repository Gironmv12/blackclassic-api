import express from 'express';
import { sequelize } from '../../../config/database.js';
import initModels from '../../../models/init-models.js';
import { body, validationResult } from 'express-validator';

const models = initModels(sequelize);
const { categorias: Categoria } = models;

const categorias = express.Router();

//crear una nueva categoria
categorias.post('/create',[
    body('nombre').notEmpty().withMessage('Nombre es requerido'),
], async (req , res) =>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()});
    }
    try {
        const {nombre} = req.body;
        const newCategoria = await Categoria.create({
            nombre,
        });
        res.status(201).json(newCategoria);
    } catch (error) {
        res.status(500).json({error: 'Error al crear la categoria', details: error.message});
    }
});

//obtener todas las categorias
categorias.get('/all', async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las categorias', details: error.message });
    }
});

//obtener una categoria por id
categorias.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoria no encontrada' });
        }
        res.status(200).json(categoria);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la categoria', details: error.message });
    }
});

//actualizar una categoria
categorias.put('/update/:id', [
    body('nombre').notEmpty().withMessage('Nombre es requerido'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    try {
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoria no encontrada' });
        }
        const { nombre } = req.body;
        categoria.nombre = nombre;
        await categoria.save();
        res.status(200).json(categoria);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la categoria', details: error.message });
    }
});

export default categorias;