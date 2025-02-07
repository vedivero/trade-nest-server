import axios from 'axios';

export class SocialAuthService {
   // 네이버 로그인 URL 생성
   static getNaverAuthUrl(): string {
      const clientId = process.env.NAVER_CLIENT_ID || '';
      const redirectUri = process.env.NAVER_REDIRECT_URI || '';
      const state = 'RANDOM_STATE';
      return `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
   }

   // 네이버 콜백 처리
   static async handleNaverCallback(code: string, state: string) {
      const clientId = process.env.NAVER_CLIENT_ID || '';
      const clientSecret = process.env.NAVER_CLIENT_SECRET || '';
      const redirectUri = process.env.NAVER_REDIRECT_URI || '';

      const tokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${code}&state=${state}`;
      const tokenResponse = await axios.get(tokenUrl);
      const { access_token } = tokenResponse.data;

      const userInfoUrl = 'https://openapi.naver.com/v1/nid/me';
      const userInfoResponse = await axios.get(userInfoUrl, {
         headers: { Authorization: `Bearer ${access_token}` },
      });

      return userInfoResponse.data; // 사용자 정보 반환
   }

   // 구글 로그인 URL 생성
   static getGoogleAuthUrl(): string {
      const clientId = process.env.GOOGLE_CLIENT_ID || '';
      const redirectUri = process.env.GOOGLE_REDIRECT_URI || '';
      return `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile`;
   }

   // 구글 콜백 처리
   static async handleGoogleCallback(code: string) {
      const clientId = process.env.GOOGLE_CLIENT_ID || '';
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
      const redirectUri = process.env.GOOGLE_REDIRECT_URI || '';

      const tokenUrl = `https://oauth2.googleapis.com/token`;
      const tokenResponse = await axios.post(tokenUrl, {
         code,
         client_id: clientId,
         client_secret: clientSecret,
         redirect_uri: redirectUri,
         grant_type: 'authorization_code',
      });
      const { access_token } = tokenResponse.data;

      const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
      const userInfoResponse = await axios.get(userInfoUrl, {
         headers: { Authorization: `Bearer ${access_token}` },
      });

      return userInfoResponse.data; // 사용자 정보 반환
   }

   // 카카오 로그인 URL 생성
   static getKakaoAuthUrl(): string {
      const clientId = process.env.KAKAO_CLIENT_ID || '';
      const redirectUri = process.env.KAKAO_REDIRECT_URI || '';
      return `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
   }

   // 카카오 콜백 처리
   static async handleKakaoCallback(code: string) {
      const clientId = process.env.KAKAO_CLIENT_ID || '';
      const clientSecret = process.env.KAKAO_CLIENT_SECRET || '';
      const redirectUri = process.env.KAKAO_REDIRECT_URI || '';

      const tokenUrl = `https://kauth.kakao.com/oauth/token`;
      const tokenResponse = await axios.post(tokenUrl, {
         code,
         client_id: clientId,
         client_secret: clientSecret,
         redirect_uri: redirectUri,
         grant_type: 'authorization_code',
      });
      const { access_token } = tokenResponse.data;

      const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
      const userInfoResponse = await axios.get(userInfoUrl, {
         headers: { Authorization: `Bearer ${access_token}` },
      });

      return userInfoResponse.data; // 사용자 정보 반환
   }
}
