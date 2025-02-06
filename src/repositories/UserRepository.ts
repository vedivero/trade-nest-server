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

export const updateUserVerification = async (token: string): Promise<boolean> => {
   try {
      const user = await User.findOne({ emailToken: token });

      if (!user || user.verified) {
         return false;
      }

      user.verified = true;
      user.emailToken = 'Verification completed';
      await user.save();

      return true;
   } catch (error) {
      console.error('❌ 이메일 인증 상태 업데이트 중 오류 발생:', error);
      throw new Error('이메일 인증 업데이트 실패');
   }
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
   try {
      return await User.findOne({ email });
   } catch (error) {
      console.error('❌ 사용자 이메일 조회 중 오류 발생:', error);
      throw new Error('사용자 조회 실패');
   }
};
