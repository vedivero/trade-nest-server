// repositories/SocialLoginRepository.ts
import User from '../../models/User';
import { SocialUserInfo } from '../../types/SocialUserInfo';

export const findOrCreateUser = async (provider: string, userInfo: SocialUserInfo): Promise<User> => {
   const { sub, email, name, picture } = userInfo;

   let user = email ? await User.findOne({ where: { email } }) : null;
   if (user) {
      if (user.social_provider !== provider) {
         await user.update({
            social_id: sub,
            social_provider: provider,
         });
      }
      return user;
   }

   return await User.create({
      user_id: `user_${Date.now()}`,
      social_id: sub,
      social_provider: provider,
      email,
      nickname: name,
      profile_image: picture,
      verified: true,
   });
};

export const findUserById_naver = async (id: string): Promise<User | null> => {
   try {
      return await User.findOne({ where: { user_id: id } });
   } catch (error) {
      console.error('❌ 사용자 조회 중 오류 발생:', error);
      return null;
   }
};
