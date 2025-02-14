import axios from 'axios';
import dotenv from 'dotenv';
import { findOrCreateUser } from '../../repositories/socialLogin/SocialLoginRepository';
import { normalizeUserInfo } from '../../utils/normalizeSocialUser';
dotenv.config();

export class GoogleAuthService {
   static getGoogleAuthUrl(): string {
      const clientId = process.env.GOOGLE_CLIENT_ID || '';
      const redirectUri = encodeURIComponent(`${process.env.BACKEND_URL}/socialLogin/google/callback`);
      const scope = 'openid email profile';
      const responseType = 'code';
      const accessType = 'offline';
      return `https://accounts.google.com/o/oauth2/v2/auth?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=${accessType}`;
   }

   static async handleGoogleCallback(code: string) {
      const tokenUrl = 'https://oauth2.googleapis.com/token';
      const tokenResponse = await axios.post(tokenUrl, null, {
         params: {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${process.env.BACKEND_URL}/socialLogin/google/callback`,
            grant_type: 'authorization_code',
         },
      });

      const { access_token } = tokenResponse.data;

      const userInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
      const userInfoResponse = await axios.get(userInfoUrl, {
         headers: { Authorization: `Bearer ${access_token}` },
      });

      const normalizedUser = normalizeUserInfo('google', userInfoResponse.data);

      return await findOrCreateUser('google', normalizedUser);
   }
}
