import User from '../Model/User';

export const createUser = async (userData: Partial<User>): Promise<User> => {
   try {
      return await User.create(userData);
   } catch (error) {
      console.error('❌ 사용자 생성 중 오류 발생:', error);
      throw new Error('사용자 생성 실패');
   }
};

export const updateUserVerification = async (token: string): Promise<User | null> => {
   try {
      const user = await User.findOne({ where: { emailToken: token } });

      if (!user || user.verified) {
         return null;
      }

      await user.update({ verified: true, emailToken: 'Verification completed' });

      return user;
   } catch (error) {
      console.error('❌ 이메일 인증 상태 업데이트 중 오류 발생:', error);
      throw new Error('이메일 인증 업데이트 실패');
   }
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
   try {
      return await User.findOne({ where: { email } });
   } catch (error) {
      console.error('❌ 사용자 이메일 조회 중 오류 발생:', error);
      throw new Error('사용자 조회 실패');
   }
};
