import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

//cargar las variables de entorno
dotenv.config();

const app = express();

//milddlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ruta de prueba
app.get('/', (req, res) => {
    res.send('Hello World');
});

//puerto de escucha
const port = process.env.PORT || 3000;

connectDB().then(() => {
    console.log('Conexión a la base de datos establecida correctamente');

    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
}).catch(error => {
    console.error('No se pudo conectar a la base de datos:', error);
});
