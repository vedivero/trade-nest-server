import { Request, Response } from 'express';
import { SocialAuthService } from '../services/NaverLoginService';

export class SocialAuthController {
   // 네이버 로그인 URL 생성
   static async naverLogin(req: Request, res: Response): Promise<void> {
      try {
         const authUrl = SocialAuthService.getNaverAuthUrl();
         res.json({ redirectUrl: authUrl });
      } catch (error) {
         console.error('네이버 로그인 URL 생성 중 오류:', error);
         res.status(500).json({ message: '네이버 로그인 URL 생성 실패' });
      }
   }

   // 네이버 로그인 콜백 처리
   static async naverCallback(req: Request, res: Response): Promise<void> {
      const { code, state } = req.query;

      if (!code || !state) {
         res.status(400).json({ message: '잘못된 요청: code 또는 state가 없습니다.' });
         return;
      }

      try {
         const userInfo = await SocialAuthService.handleNaverCallback(code as string, state as string);
         res.json(userInfo);
      } catch (error) {
         console.error('네이버 로그인 콜백 처리 중 오류:', error);
         res.status(500).json({ message: '네이버 로그인 실패' });
      }
   }
}
