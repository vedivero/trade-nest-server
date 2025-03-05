import User from '../../models/User';
import UserRepository from '../../repositories/user/UserRepository';
import bcrypt from 'bcrypt';

class UserService {
   async getUserInfo(id: number): Promise<User | null> {
      const userInfo = await UserRepository.findUserInfo(id);
      return userInfo;
   }

   async updateUserInfo(userId: number, password: string, location: string): Promise<void> {
      const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해싱
      await UserRepository.updateUserInfo(userId, hashedPassword, location);
   }
}

export default new UserService();
