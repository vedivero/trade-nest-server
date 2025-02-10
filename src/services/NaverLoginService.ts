import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
import { findOrCreateUser, findUserById } from '../repositories/NaverLoginRepository';
dotenv.config();

export class NaverSocialAuthService {
   // 네이버 로그인 URL 생성
   static getNaverAuthUrl(): string {
      const clientId = process.env.NAVER_CLIENT_ID || '';
      const redirectUri = encodeURIComponent(`${process.env.BACKEND_URL}/socialLogin/naver/callback`);
      const state = 'RANDOM_STATE';
      return `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
   }

   // 네이버 콜백 처리
   static async handleNaverCallback(code: string, state: string) {
      const clientId = process.env.NAVER_CLIENT_ID || '';
      const clientSecret = process.env.NAVER_CLIENT_SECRET || '';
      const redirectUri = `${process.env.BACKEND_URL}/socialLogin/naver/callback`;

      try {
         const tokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${code}&state=${state}`;
         const tokenResponse = await axios.get(tokenUrl);
         const { access_token } = tokenResponse.data;

         const userInfoUrl = 'https://openapi.naver.com/v1/nid/me';
         const userInfoResponse = await axios.get(userInfoUrl, {
            headers: { Authorization: `Bearer ${access_token}` },
         });

         // 유저 정보 저장 및 반환
         const user = await findOrCreateUser('naver', userInfoResponse.data);
         return user;
      } catch (error) {
         console.error('네이버 로그인 처리 중 오류:', error);
         throw new Error('네이버 로그인 처리 중 오류 발생');
      }
   }

   static async getUserFromToken(req: Request) {
      const token = req.cookies.accessToken;
      if (!token) throw new Error('토큰 없음');

      try {
         const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY as string) as JwtPayload;
         return findUserById(decoded.id);
      } catch (error) {
         throw new Error('유효하지 않은 토큰');
      }
   }
}
