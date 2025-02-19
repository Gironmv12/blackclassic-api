import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import userRouter from './routes/routes.js';
import authRouter from './routes/authRoute.js';
import cors from 'cors';

//cargar las variables de entorno
dotenv.config();
const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
};

const app = express();
app.use(cors(corsConfig));

//milddlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ruta de prueba
app.get('/', (req, res) => {
    res.send('Hello World');
});

//puerto de escucha
const port = process.env.PORT || 3000;

// Usar las rutas importadas
app.use('/api', userRouter);

// Usar las ruta de autenticación
app.use('/api', authRouter);

connectDB().then(() => {
    console.log('Conexión a la base de datos establecida correctamente');

    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
}).catch(error => {
    console.error('No se pudo conectar a la base de datos:', error);
});


