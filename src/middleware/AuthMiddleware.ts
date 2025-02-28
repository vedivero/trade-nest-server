import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface CustomJwtPayload extends JwtPayload {
   user_id: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
   try {
      const userInfo = req.cookies?.userInfo ? JSON.parse(req.cookies.userInfo) : null;

      if (!userInfo || !userInfo.id) {
         res.status(httpStatus.UNAUTHORIZED).json({ message: '로그인이 필요합니다.' });
      }

      req.user = userInfo;

      next();
   } catch (error) {
      console.error('❌ 유효하지 않은 토큰입니다:', error);
      res.status(httpStatus.UNAUTHORIZED).json({ message: '유효하지 않은 토큰입니다.' });
   }
};

/**
 * 선택적 인증 미들웨어
 * - 로그인한 경우 req.user 설정
 * - 로그인하지 않은 경우 req.user = null 유지
 */
export const optionalVerifyToken = (req: Request, res: Response, next: NextFunction): void => {
   try {
      const userInfo = req.cookies?.userInfo ? JSON.parse(req.cookies.userInfo) : null;

      req.user = userInfo;
      console.log('🔍 optionalVerifyToken 파싱된 유저 정보:', req.user);

      next();
   } catch (error) {
      console.error('❌ 유효하지 않은 토큰입니다:', error);
      req.user = null;
      next();
   }
};
