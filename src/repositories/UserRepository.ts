import User, { IUser } from '../Model/User';

export const findUserBySocialId = async (
   social_id: string,
   social_provider: string,
): Promise<IUser | null> => {
   try {
      return await User.findOne({ social_id, social_provider });
   } catch (error) {
      console.error('❌ 사용자 검색 중 오류 발생:', error);
      throw new Error('사용자 조회 실패');
   }
};

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
   try {
      const user = new User(userData);
      return await user.save();
   } catch (error) {
      console.error('❌ 사용자 생성 중 오류 발생:', error);
      throw new Error('사용자 생성 실패');
   }
};
