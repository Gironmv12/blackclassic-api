import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

// Conexión en producción solo si estamos en producción y DATABASE_URL está definida
let sequelize;
if (isProduction && process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        protocol: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Ajusta esto según tus necesidades
            }
        },
        logging: false
    });
} else {
    // Conexión local
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: "postgres",
            logging: false
        }
    );
    // Opción: para pruebas de conexión local, puedes comentar DATABASE_URL en tu .env
}

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexión a la base de datos establecida correctamente");

        // Sincronizar a la base de datos
        await sequelize.sync();
        console.log("Tablas sincronizadas correctamente");

    } catch (error) {
        console.error("No se pudo conectar a la base de datos:", error);
        throw error;
    }
};

export { sequelize, connectDB };