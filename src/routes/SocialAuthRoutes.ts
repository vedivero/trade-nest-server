import { Router } from 'express';
import { SocialAuthController } from '../controllers/SocialAuthController';

import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const router = Router();

router.get('/naver', (req, res) => {
   const clientId = process.env.NAVER_CLIENT_ID;
   const redirectUri = encodeURIComponent(`${process.env.BACKEND_URL}/socialLogin/naver/callback`);
   const state = 'RANDOM_STATE';
   const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
   res.json({ redirectUrl: naverAuthUrl });
});

router.get('/naver/callback', async (req, res) => {
   const { code, state } = req.query;
   const clientId = process.env.NAVER_CLIENT_ID;
   const clientSecret = process.env.NAVER_CLIENT_SECRET;
   const redirectUri = `${process.env.BACKEND_URL}/socialLogin/naver/callback`;

   try {
      const tokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${code}&state=${state}`;
      const tokenResponse = await axios.get(tokenUrl);
      const accessToken = tokenResponse.data.access_token;

      const userInfoUrl = `https://openapi.naver.com/v1/nid/me`;
      const userInfoResponse = await axios.get(userInfoUrl, {
         headers: { Authorization: `Bearer ${accessToken}` },
      });

      res.json(userInfoResponse.data);
   } catch (error) {
      console.error('네이버 로그인 콜백 처리 중 오류:', error);
      res.status(500).json({ message: '네이버 로그인 실패' });
   }
});
router.get('/google', SocialAuthController.googleLogin);
router.get('/google/callback', SocialAuthController.googleCallback);
router.get('/kakao', SocialAuthController.kakaoLogin);
router.get('/kakao/callback', SocialAuthController.kakaoCallback);

export default router;
