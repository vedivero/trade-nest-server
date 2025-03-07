import User from '../../models/User';
import UserRepository from '../../repositories/user/UserRepository';
import bcrypt from 'bcrypt';

class UserService {
   async getUserInfo(id: number): Promise<User | null> {
      const userInfo = await UserRepository.findUserInfo(id);
      return userInfo;
   }

   /**
    * 회원 정보 업데이트
    * @param userId 사용자 ID
    * @param password 새로운 비밀번호 (선택적)
    * @param location 새로운 위치 정보
    * @param password_reset 비밀번호 초기화 상태 (선택적)
    */
   async updateUserInfo(
      userId: number,
      password: string | undefined,
      location: string,
      password_reset?: boolean, // 선택적(optional)으로 변경
   ): Promise<void> {
      let hashedPassword: string | undefined;

      if (password) {
         hashedPassword = await bcrypt.hash(password, 10);
      }

      // Repository로 전달 시 선택적 속성으로 전달
      await UserRepository.updateUserInfo(userId, hashedPassword, location, password_reset);
   }
}

export default new UserService();
