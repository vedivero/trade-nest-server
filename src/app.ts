import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db';
import AuthRouter from './routes/AuthRouts';
import ProductRouter from './routes/ProductRouts';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT;

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
