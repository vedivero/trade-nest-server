import User from '../../models/User';
import UserRepository from '../../repositories/user/UserRepository';

class UserService {
   async getUserInfo(id: number) {
      const userInfo = await UserRepository.findUserInfo(id);
      return userInfo;
   }
}

export default new UserService();
