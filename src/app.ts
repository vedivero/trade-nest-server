import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db';
import { socialLogin } from './controllers/AuthController';

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

app.post('/login', socialLogin);

initializeServer();
