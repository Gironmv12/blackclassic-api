import express from 'express';
import { sequelize } from '../../config/database.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import initModels from '../../models/init-models.js';

const user = express.Router();

// Inicializar el modelo de usuarios
const models = initModels(sequelize);
const { usuarios: Usuario, roles: Rol, estados: Estado } = models;

// Crear un usuario
user.post('/create', [
    body('nombre').isString().notEmpty().withMessage('El nombre es requerido'),
    body('apellidopaterno').isString().notEmpty().withMessage('El apellido paterno es requerido'),
    body('apellidomaterno').isString().notEmpty().withMessage('El apellido materno es requerido'),
    body('telefono').isString().notEmpty().withMessage('El telefono es requerido'),
    body('correo').isEmail().notEmpty().withMessage('El correo es requerido'),
    body('contrasena').isString().notEmpty().withMessage('La contraseña es requerida'),
    body('rol_id').isInt().notEmpty().withMessage('El rol es requerido'), 
    body('estado_id').isInt().optional(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const { nombre, apellidopaterno, apellidomaterno, telefono, correo, contrasena, rol_id, estado_id } = req.body;

    try {
        const salt = bcrypt.genSaltSync(10);
        const contrasenaHash = bcrypt.hashSync(contrasena, salt);

        const nuevoUsuario = await Usuario.create({
            nombre,
            apellidopaterno,
            apellidomaterno,
            telefono,
            correo,
            contrasena: contrasenaHash,
            rol_id,
            estado_id: estado_id || null,
        });

        res.status(201).json(nuevoUsuario);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
});

// Obtener todos los usuarios
user.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            include: [
                { model: Rol, as: 'rolAsociado', attributes: ['nombre'] },
                { model: Estado, as: 'estado', attributes: ['nombre'] },
            ],
        });
        res.status(200).json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
});

// Obtener un usuario por su id
user.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findByPk(id, {
            include: [
                { model: Rol, as: 'rolAsociado', attributes: ['nombre'] },
                { model: Estado, as: 'estado', attributes: ['nombre'] },
            ],
        });
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
});

//actualizar un usuario
user.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidopaterno, apellidomaterno, telefono, correo, contrasena, rol_id, estado_id } = req.body;

    try {
        const usuario = await Usuario.findByPk(id);
        if (usuario) {
            usuario.nombre = nombre;
            usuario.apellidopaterno = apellidopaterno;
            usuario.apellidomaterno = apellidomaterno;
            usuario.telefono = telefono;
            usuario.correo = correo;
            usuario.rol_id = rol_id;
            usuario.estado_id = estado_id;

            if (contrasena) {
                const salt = bcrypt.genSaltSync(10);
                usuario.contrasena = bcrypt.hashSync(contrasena, salt);
            }

            await usuario.save();
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
});

// Eliminar un usuario
user.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findByPk(id);
        if (usuario) {
            await usuario.destroy();
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
});
 
export default user;