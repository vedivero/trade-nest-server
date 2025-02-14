import { SocialUserInfo } from '../types/SocialUserInfo';

export const normalizeUserInfo = (provider: 'google' | 'naver' | 'kakao', rawData: any): SocialUserInfo => {
   switch (provider) {
      case 'google':
         return {
            sub: rawData.sub,
            email: rawData.email,
            name: rawData.name,
            picture: rawData.picture,
         };

      case 'naver':
         return {
            sub: rawData.response.id,
            email: rawData.response.email,
            name: rawData.response.nickname,
            picture: rawData.response.profile_image,
         };

      case 'kakao':
         return {
            sub: rawData.id.toString(),
            email: rawData.kakao_account?.email,
            name: rawData.properties?.nickname || rawData.kakao_account?.profile?.nickname,
            picture: rawData.kakao_account?.profile?.thumbnail_image_url,
         };

      default:
         throw new Error(`Unsupported provider: ${provider}`);
   }
};
