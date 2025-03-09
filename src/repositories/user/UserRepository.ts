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

   /**
    * 회원 정보 업데이트
    * @param userId 사용자 ID
    * @param password 암호화된 비밀번호 (선택적)
    * @param location 업데이트할 위치 정보
    * @param resetPassword 비밀번호 초기화 상태를 false로 변경할지 여부
    */
   async updateUserInfo(
      userId: number,
      password: string | undefined,
      location: string,
      password_reset?: boolean, // 선택적(optional)으로 변경
   ): Promise<void> {
      try {
         const updateData: { password?: string; location: string; password_reset?: boolean } = { location };

         if (password) {
            updateData.password = password;
         }

         if (typeof password_reset === 'boolean') {
            updateData.password_reset = password_reset;
         }

         await User.update(updateData, { where: { id: userId } });
      } catch (error) {
         console.error('회원 정보 업데이트 실패 : ', error);
         throw new Error('회원 정보 업데이트 실패');
      }
   }
}

export default new UserRepository();
