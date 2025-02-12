import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
   process.env.DB_DATABASE as string,
   process.env.DB_USERNAME as string,
   process.env.DB_PASSWORD as string,
   {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
   },
);

export default sequelize;
