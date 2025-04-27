import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Importa bcryptjs para comparar contraseñas hasheadas
import { sequelize } from '../../config/database.js';
import { body, validationResult } from 'express-validator';
import initModels from '../../models/init-models.js';


const auth = express.Router();

const models = initModels(sequelize);
const { usuarios: Usuario } = models;


// Validaciones para el login
const loginValidations = [
    body('correo')
        .isEmail()
        .withMessage('Debe ingresar un correo electrónico válido'),
    body('contrasena')
        .isString()
        .notEmpty()
        .withMessage('La contraseña es requerida'),
];

// inicio de sesión usando JWT
auth.post('/login', loginValidations, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const { correo, contrasena } = req.body;

    try {
        const usuario = await Usuario.findOne({
            where: { correo }
        });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Comparar la contraseña en texto plano con la contraseña hasheada en la BD
        const passwordValid = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!passwordValid) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Preparar payload mínimo para el token
        const payload = {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol
        };

        // Generar el token JWT
        const token = jwt.sign(payload, 'secretkey', { expiresIn: '1h' });

        // Retornar token junto a datos mínimos del usuario
        res.status(200).json({ token, user: payload });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});



export default auth;