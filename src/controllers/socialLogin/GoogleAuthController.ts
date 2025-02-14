import { Request, Response } from 'express';
import { GoogleAuthService } from '../../services/socialLogin/GoogleAuthService';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

export class GoogleAuthController {
   static async googleLogin(req: Request, res: Response): Promise<void> {
      try {
         const authUrl = GoogleAuthService.getGoogleAuthUrl();
         res.json({ redirectUrl: authUrl });
      } catch (error) {
         console.error('구글 로그인 URL 생성 중 오류:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '구글 로그인 URL 생성 실패' });
      }
   }

   static async googleCallback(req: Request, res: Response): Promise<void> {
      const { code } = req.query;

      if (!code) {
         res.status(httpStatus.BAD_REQUEST).json({ message: '잘못된 요청: code가 없습니다.' });
         return;
      }

      try {
         const userInfo = await GoogleAuthService.handleGoogleCallback(code as string);

         const token = jwt.sign(
            { id: userInfo.id, email: userInfo.email },
            process.env.JWT_ACCESS_SECRET_KEY as string,
            { expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRATION || '3600', 10) },
         );

         res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
         });

         res.cookie('userInfo', JSON.stringify(userInfo));
         res.redirect(`${process.env.FRONTEND_URL}/`);
      } catch (error) {
         console.error('구글 로그인 콜백 처리 중 오류:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '구글 로그인 실패' });
      }
   }
}
