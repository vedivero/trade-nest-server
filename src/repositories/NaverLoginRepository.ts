import User from '../Model/User'; // Sequelize 모델

export const findOrCreateUser = async (provider: string, userInfo: any): Promise<User> => {
   const { id, email, nickname } = userInfo.response || userInfo;

   let user = await User.findOne({ where: { social_id: id, social_provider: provider } });

   if (!user) {
      user = await User.create({
         user_id: `user_${Date.now()}`,
         social_id: id,
         social_provider: provider,
         email: email || '',
         nickname: nickname || '',
         verified: true,
      });
   }

   return user;
};

export const findUserById = async (id: string): Promise<User | null> => {
   try {
      return await User.findOne({ where: { user_id: id } });
   } catch (error) {
      console.error('❌ 사용자 조회 중 오류 발생:', error);
      return null;
   }
};
