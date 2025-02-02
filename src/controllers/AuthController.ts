import { Request, Response } from 'express';
import { handleSocialLogin } from '../services/AuthService';
import httpStatus from 'http-status';

export const socialLogin = async (req: Request, res: Response): Promise<void> => {
   try {
      const { social_id, social_provider, email, nickname, profile_image } = req.body;

      if (!social_id || !social_provider || !nickname) {
         res.status(httpStatus.BAD_REQUEST).json({ message: '필수 정보가 누락되었습니다.' });
         return;
      }

      const user = await handleSocialLogin({
         social_id,
         social_provider,
         email,
         nickname,
         profile_image,
      });

      res.status(httpStatus.OK).json({ message: '로그인 성공', user });
   } catch (error) {
      console.error('❌ 요청 처리 중 오류 발생:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error || '서버 오류' });
   }
};
