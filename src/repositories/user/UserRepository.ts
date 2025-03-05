import User from '../../models/User';

class UserRepository {
   async findUserInfo(id: number): Promise<User | null> {
      try {
         return await User.findOne({
            where: { id: id },
            attributes: { exclude: ['password'] },
         });
      } catch (error) {
         console.error('회원 상세 정보 조회 실패 : ', error);
         throw new Error('회원 상세 정보 조회 실패');
      }
   }

   async updateUserInfo(userId: number, password: string, location: string): Promise<void> {
      try {
         await User.update({ password, location: location }, { where: { id: userId } });
      } catch (error) {
         console.error('회원 정보 업데이트 실패 : ', error);
         throw new Error('회원 정보 업데이트 실패');
      }
   }
}

export default new UserRepository();
