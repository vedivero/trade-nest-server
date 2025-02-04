import { IUser } from '../Model/User';
import { createUser, findUserBySocialId } from '../repositories/UserRepository';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

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

export const generateTokens = (user: IUser) => {
   const payload = {
      user_id: user.user_id,
      social_provider: user.social_provider,
   };

   const accessSecret = process.env.JWT_ACCESS_SECRET_KEY || '';
   const refreshSecret = process.env.JWT_REFRESH_SECRET_KEY || '';

   if (!accessSecret || !refreshSecret) {
      throw new Error('JWT 비밀키가 설정되지 않았습니다.');
   }

   const accessToken = jwt.sign(payload, accessSecret, { expiresIn: '1h' });
   const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

   return { accessToken, refreshToken };
};
