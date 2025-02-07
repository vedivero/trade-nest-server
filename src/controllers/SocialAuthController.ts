import { Request, Response } from 'express';
import { SocialAuthService } from '../services/SocialAuthService';

export class SocialAuthController {
   // 네이버 로그인 URL 생성
   static async naverLogin(req: Request, res: Response) {
      console.log('네이버 로그인');
      const authUrl = SocialAuthService.getNaverAuthUrl();
      res.redirect(authUrl);
   }

   // 네이버 로그인 콜백 처리
   static async naverCallback(req: Request, res: Response) {
      const { code, state } = req.query;
      try {
         const userInfo = await SocialAuthService.handleNaverCallback(code as string, state as string);
         res.json(userInfo);
      } catch (error) {
         res.status(500).json({ message: '네이버 로그인 실패', error });
      }
   }

   // 구글 로그인 URL 생성
   static async googleLogin(req: Request, res: Response) {
      const authUrl = SocialAuthService.getGoogleAuthUrl();
      res.redirect(authUrl);
   }

   // 구글 로그인 콜백 처리
   static async googleCallback(req: Request, res: Response) {
      const { code } = req.query;
      try {
         const userInfo = await SocialAuthService.handleGoogleCallback(code as string);
         res.json(userInfo);
      } catch (error) {
         res.status(500).json({ message: '구글 로그인 실패', error });
      }
   }

   // 카카오 로그인 URL 생성
   static async kakaoLogin(req: Request, res: Response) {
      const authUrl = SocialAuthService.getKakaoAuthUrl();
      res.redirect(authUrl);
   }

   // 카카오 로그인 콜백 처리
   static async kakaoCallback(req: Request, res: Response) {
      const { code } = req.query;
      try {
         const userInfo = await SocialAuthService.handleKakaoCallback(code as string);
         res.json(userInfo);
      } catch (error) {
         res.status(500).json({ message: '카카오 로그인 실패', error });
      }
   }
}
