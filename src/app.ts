import dotenv from 'dotenv';
import express from 'express';
import sequelize from './config/database';
import AuthRouter from './routes/AuthRoutes';
import SocialRoutes from './routes/SocialLoginRoutes';
import ProductRouter from './routes/ProductRoutes';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
   cors({
      origin: process.env.FRONTEND_URL,
      methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      allowedHeaders: 'Authorization, Content-Type, accessToken, refreshToken',
      credentials: true,
   }),
);

const initializeServer = async () => {
   try {
      await sequelize.authenticate();
      console.log('✅ PostgreSQL Database connected successfully');

      await sequelize.sync();
      console.log('✅ 데이터베이스 동기화 완료');

      app.listen(PORT, () => {
         console.log(`✅ Server running ON, PORT Number is ${PORT}`);
      });
   } catch (error) {
      console.error('❌ Failed to start server:', error);
   }
};
app.use((req, res, next) => {
   console.log(`📢 [요청 감지] ${req.method} ${req.path}`);
   next();
});

app.use('/auth', AuthRouter);
app.use('/socialLogin', SocialRoutes);
app.use('/product', ProductRouter);

initializeServer();
