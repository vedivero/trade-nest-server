import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
import { findOrCreateUser, findUserById_naver } from '../../repositories/socialLogin/SocialLoginRepository';
import { normalizeUserInfo } from '../../utils/normalizeSocialUser';
dotenv.config();

export class NaverSocialAuthService {
   static getNaverAuthUrl(): string {
      const clientId = process.env.NAVER_CLIENT_ID || '';
      const redirectUri = encodeURIComponent(`${process.env.BACKEND_URL}/socialLogin/naver/callback`);
      const state = 'RANDOM_STATE';
      return `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
   }

   static async handleNaverCallback(code: string, state: string) {
      const tokenUrl = `https://nid.naver.com/oauth2.0/token`;
      const tokenResponse = await axios.get(tokenUrl, {
         params: {
            grant_type: 'authorization_code',
            client_id: process.env.NAVER_CLIENT_ID,
            client_secret: process.env.NAVER_CLIENT_SECRET,
            redirect_uri: process.env.BACKEND_URL,
            code,
            state,
         },
      });
      const { access_token } = tokenResponse.data;

      const userInfoUrl = 'https://openapi.naver.com/v1/nid/me';
      const userInfoResponse = await axios.get(userInfoUrl, {
         headers: { Authorization: `Bearer ${access_token}` },
      });
      const normalizedUser = normalizeUserInfo('naver', userInfoResponse.data);
      const user = await findOrCreateUser('naver', normalizedUser);
      return user;
   }

   static async getUserFromToken(req: Request) {
      const token = req.cookies.accessToken;
      if (!token) throw new Error('토큰 없음');

      try {
         const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY as string) as JwtPayload;
         return findUserById_naver(decoded.id);
      } catch (error) {
         throw new Error('유효하지 않은 토큰');
      }
   }
}
