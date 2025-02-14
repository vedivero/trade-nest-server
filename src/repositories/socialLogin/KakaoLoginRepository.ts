import User from '../../Model/User';

export class KakaoAuthRepository {
   static async findOrCreateUser(provider: string, userProfile: any) {
      const { id, kakao_account } = userProfile;
      const email = kakao_account?.email || null;
      const nickname = kakao_account?.profile?.nickname || null;
      const profileImage = kakao_account?.profile?.profile_image_url || null;

      let user = await User.findOne({ where: { social_id: String(id) } });

      if (!user) {
         user = await User.create({
            user_id: `user_${Date.now()}`,
            social_id: String(userProfile.id),
            social_provider: provider,
            email,
            nickname,
            profile_image: profileImage,
            verified: true,
         });
      }

      return user;
   }
}
