import { IUser } from '../Model/User';
import { createUser, findUserBySocialId } from '../repositories/UserRepository';

interface SocialLoginData {
   social_id: string;
   social_provider: string;
   email?: string;
   nickname: string;
   profile_image?: string;
}

export const handleSocialLogin = async (loginData: SocialLoginData): Promise<IUser> => {
   const { social_id, social_provider } = loginData;

   try {
      let user = await findUserBySocialId(social_id, social_provider);

      if (!user) {
         user = await createUser({
            user_id: `user_${Date.now()}`,
            ...loginData,
         });
      }
      return user;
   } catch (error) {
      console.error('❌ 소셜 로그인 처리 중 오류 발생:', error);
      throw new Error('소셜 로그인 처리 실패');
   }
};
