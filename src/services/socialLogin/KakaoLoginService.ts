import axios from 'axios';
import { KakaoAuthRepository } from '../../repositories/socialLogin/KakaoLoginRepository';

export class KakaoAuthService {
   static getKakaoAuthUrl(): string {
      return `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&response_type=code`;
   }

   static async handleKakaoCallback(code: string) {
      const tokenUrl = 'https://kauth.kakao.com/oauth/token';
      const userUrl = 'https://kapi.kakao.com/v2/user/me';

      try {
         const tokenResponse = await axios.post(tokenUrl, null, {
            params: {
               grant_type: 'authorization_code',
               client_id: process.env.KAKAO_CLIENT_ID,
               ...(process.env.KAKAO_CLIENT_SECRET ? { client_secret: process.env.KAKAO_CLIENT_SECRET } : {}),
               redirect_uri: process.env.KAKAO_REDIRECT_URI,
               code,
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
         });

         const accessToken = tokenResponse.data.access_token;

         const userResponse = await axios.get(userUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
         });

         const userProfile = userResponse.data;
         return await KakaoAuthRepository.findOrCreateUser('kakao', userProfile);
      } catch (error) {
         console.error('❌ 카카오 로그인 요청 실패 ', error);
         throw new Error('카카오 로그인 요청 실패');
      }
   }
}
