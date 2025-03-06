import User from '../../models/User';
import UserRepository from '../../repositories/user/UserRepository';
import bcrypt from 'bcrypt';

class UserService {
   async getUserInfo(id: number): Promise<User | null> {
      const userInfo = await UserRepository.findUserInfo(id);
      return userInfo;
   }

   async updateUserInfo(userId: number, password: string | undefined, location: string): Promise<void> {
      let hashedPassword: string | undefined;

      // 비밀번호가 있을 때만 해싱
      if (password) {
         hashedPassword = await bcrypt.hash(password, 10);
      }

      await UserRepository.updateUserInfo(userId, hashedPassword, location);
   }
}

export default new UserService();
