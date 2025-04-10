import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import userRouter from './routes/routes.js';
import authRouter from './routes/authRoute.js';
import aceessoRouter from './routes/accesoRoutes.js';
import mesasRouter from './routes/mesasRouter.js';
import reservasRouter from './routes/reservasRoutes.js';
import recepcionRoute from './routes/recepcionRoute.js';
import categoriasRouter from './routes/categoriasRoute.js';
import productosRoute from './routes/productosRoute.js';
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

//usar la ruta de accesos
app.use('/api', aceessoRouter);

//usar la ruta de mesas
app.use('/api', mesasRouter);

//usar la ruta de reservas
app.use('/api', reservasRouter);

//usar la ruta de recepcion
app.use('/api', recepcionRoute);

//usar la ruta de categorias
app.use('/api', categoriasRouter);

//usar la ruta de productos
app.use('/api', productosRoute);

connectDB().then(() => {
    console.log('Conexión a la base de datos establecida correctamente');

    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
}).catch(error => {
    console.error('No se pudo conectar a la base de datos:', error);
});


