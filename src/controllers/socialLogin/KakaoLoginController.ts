import { Request, Response } from 'express';
import { KakaoAuthService } from '../../services/socialLogin/KakaoLoginService';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

export class KakaoAuthController {
   static async kakaoLogin(req: Request, res: Response): Promise<void> {
      try {
         const authUrl = KakaoAuthService.getKakaoAuthUrl();
         res.json({ redirectUrl: authUrl });
      } catch (error) {
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '카카오 로그인 URL 생성 실패' });
      }
   }

   static async kakaoCallback(req: Request, res: Response): Promise<void> {
      const { code } = req.query;

      if (!code) {
         res.status(httpStatus.BAD_REQUEST).json({ message: '잘못된 요청: code 값이 없습니다.' });
         return;
      }

      try {
         const userInfo = await KakaoAuthService.handleKakaoCallback(code as string);
         const token = jwt.sign(
            { id: userInfo.id, email: userInfo.email },
            process.env.JWT_ACCESS_SECRET_KEY as string,
            { expiresIn: '1h' },
         );

         res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1시간
         });

         res.cookie('userInfo', JSON.stringify(userInfo), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
         });

         res.redirect(`${process.env.FRONTEND_URL}/`);
      } catch (error) {
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '카카오 로그인 실패' });
      }
   }
}
