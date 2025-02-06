import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db';
import AuthRouter from './routes/AuthRouts';
import ProductRouter from './routes/ProductRouts';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
   cors({
      origin: process.env.FRONTEND_URL,
      methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      allowedHeaders: 'Authorization, Content-Type, accessToken, refreshToken ',
      credentials: true,
   }),
);

const initializeServer = async () => {
   try {
      await connectDB();
      app.listen(PORT, () => {
         console.log(`✅ Server running ON, PORT Number is ${PORT}`);
      });
   } catch (error) {
      console.error('Failed to start server', error);
   }
};

app.use('/auth', AuthRouter);
app.use('/product', ProductRouter);

initializeServer();
