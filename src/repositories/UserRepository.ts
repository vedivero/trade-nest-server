import User from '../Model/User';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

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

export const sendNewPassword = async (email: string): Promise<{ user: User; newPassword: string } | null> => {
   try {
      const user = await User.findOne({ where: { email, social_provider: 'self' } });

      if (!user) throw new Error('해당 메일 주소를 가진 회원 정보가 존재하지 않습니다.');

      const newPassword = crypto
         .randomBytes(9)
         .toString('base64')
         .replace(/[^a-zA-Z0-9]/g, '')
         .slice(0, 12);

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await user.update({ password: hashedPassword });
      return { user, newPassword };
   } catch (error) {
      console.error('❌ 비밀번호 초기화 실패:', error);
      throw new Error('비밀번호 초기화 실패');
   }
};
