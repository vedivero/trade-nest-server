import User, { IUser } from '../Model/User';

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
   try {
      const user = new User(userData);
      return await user.save();
   } catch (error) {
      console.error('❌ 사용자 생성 중 오류 발생:', error);
      throw new Error('사용자 생성 실패');
   }
};

export const updateUserVerification = async (token: string): Promise<IUser | null> => {
   try {
      const user = await User.findOne({ emailToken: token });

      if (!user || user.verified) {
         return null;
      }

      user.verified = true;
      user.emailToken = 'Verification completed';
      await user.save();

      return user;
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
