import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db';
import authRouter from './routes/authRouts';

dotenv.config();
const app = express();
app.use(express.json());
<<<<<<< Updated upstream

const PORT = process.env.PORT;
=======
app.use(
   cors({
      origin: process.env.FRONTEND_URL,
      methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      allowedHeaders: 'Authorization, Content-Type, accessToken, refreshToken ',
      credentials: true,
   }),
);
>>>>>>> Stashed changes

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

app.use('/auth', authRouter);

initializeServer();
