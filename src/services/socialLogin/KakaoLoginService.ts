import axios from 'axios';
import { findOrCreateUser } from '../../repositories/socialLogin/SocialLoginRepository';
import { normalizeUserInfo } from '../../utils/normalizeSocialUser';
import dotenv from 'dotenv';
dotenv.config();

export class KakaoAuthService {
   static getKakaoAuthUrl(): string {
      console.log('카카오 로그인');
      return `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&response_type=code`;
   }

   static async handleKakaoCallback(code: string) {
      const tokenUrl = 'https://kauth.kakao.com/oauth/token';
      const tokenResponse = await axios.post(tokenUrl, null, {
         params: {
            grant_type: 'authorization_code',
            client_id: process.env.KAKAO_CLIENT_ID,
            client_secret: process.env.KAKAO_CLIENT_SECRET,
            redirect_uri: `${process.env.BACKEND_URL}/socialLogin/kakao/callback`,
            code,
         },
      });

      const { access_token } = tokenResponse.data;

      const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
      const userInfoResponse = await axios.get(userInfoUrl, {
         headers: { Authorization: `Bearer ${access_token}` },
      });

      const normalizedUser = normalizeUserInfo('kakao', userInfoResponse.data);

      return await findOrCreateUser('kakao', normalizedUser);
   }
}
