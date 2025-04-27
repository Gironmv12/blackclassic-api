import express from 'express';
import { sequelize } from '../../../config/database.js';
import { body, validationResult } from 'express-validator';
import initModels from '../../../models/init-models.js';

const roles = express.Router();

const models = initModels(sequelize);
const { roles: Roles } = models;
const { usuarios: Usuario } = models;