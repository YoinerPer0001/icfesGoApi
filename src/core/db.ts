import sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const PORT : number = parseInt(process.env.DB_PORT ?? "3000"); 

export const db = new sequelize.Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: PORT,
    database: process.env.DB_NAME ?? 'postgress',
    username: process.env.DB_USER ?? 'admin',
    password: process.env.DB_PASSWORD ?? 'admin',
})

try {
    await db.authenticate()
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}