import { Request, Response } from 'express';
import { NaverSocialAuthService } from '../../services/socialLogin/NaverLoginService';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

export class NaverAuthController {
   static async naverLogin(req: Request, res: Response): Promise<void> {
      try {
         const authUrl = NaverSocialAuthService.getNaverAuthUrl();
         res.json({ redirectUrl: authUrl });
      } catch (error) {
         console.error('네이버 로그인 URL 생성 중 오류:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '네이버 로그인 URL 생성 실패' });
      }
   }

   static async naverCallback(req: Request, res: Response): Promise<void> {
      const { code, state } = req.query;

      if (!code || !state) {
         res.status(httpStatus.BAD_REQUEST).json({ message: '잘못된 요청: code 또는 state가 없습니다.' });
         return;
      }

      try {
         const userInfo = await NaverSocialAuthService.handleNaverCallback(code as string, state as string);

         const token = jwt.sign(
            { id: userInfo.id, email: userInfo.email },
            process.env.JWT_ACCESS_SECRET_KEY as string,
            {
               expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRATION || '3600', 10),
            },
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
         console.error('네이버 로그인 콜백 처리 중 오류:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '네이버 로그인 실패' });
      }
   }
}
