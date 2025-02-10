import User, { IUser } from '../Model/User';

export const findOrCreateUser = async (provider: string, userInfo: any): Promise<IUser> => {
   const { id, email, nickname } = userInfo.response || userInfo;

   let user = await User.findOne({ social_id: id, social_provider: provider });

   if (!user) {
      user = new User({
         user_id: `user_${Date.now()}`,
         social_id: id,
         social_provider: provider,
         email: email || '',
         nickname: nickname || '',
         verified: true,
      });
      await user.save();
   }

   return user;
};

export const findUserById = async (id: string): Promise<IUser | null> => {
   try {
      return await User.findOne({ user_id: id }).exec();
   } catch (error) {
      return null;
   }
};
