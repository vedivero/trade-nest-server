import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
   try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
         res.status(httpStatus.UNAUTHORIZED).json({ message: '토큰이 제공되지 않았습니다.' });
         return;
      }

      const secret = process.env.JWT_ACCESS_SECRET_KEY!;
      const decoded = jwt.verify(token, secret);

      req.user = decoded;

      next();
   } catch (error) {
      console.error('❌ 유효하지 않은 토큰입니다:', error);
      res.status(httpStatus.UNAUTHORIZED).json({ message: '유효하지 않은 토큰입니다.' });
   }
};
