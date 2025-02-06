import { Request, Response } from 'express';
<<<<<<< Updated upstream
import { handleSocialLogin } from '../services/AuthService';
=======
import {
   generateTokens,
   handleEmailLogin,
   handleEmailSignUp,
   handleSocialLogin,
   verifyEmailToken,
} from '../services/AuthService';
>>>>>>> Stashed changes
import httpStatus from 'http-status';

export const emailSignUp = async (req: Request, res: Response): Promise<void> => {
   try {
      const { email, password, nickname } = req.body;

      console.log(req.body);

      if (!email || !password || !nickname) {
         res.status(httpStatus.BAD_REQUEST).json({ message: '필수 정보를 입력해 주세요.' });
         return;
      }
      await handleEmailSignUp({ email, password, nickname });
      res.status(httpStatus.OK).json({ message: '회원가입 성공! 이메일을 확인해 주세요.' });
   } catch (error) {
      console.error('❌ 이메일 회원가입 중 오류 발생:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '회원가입 실패', error });
   }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
   try {
      const { token } = req.query;
      const result = await verifyEmailToken(token as string);

      if (!result) {
         res.status(httpStatus.BAD_REQUEST).json({ message: '유효하지 않은 토큰입니다.' });
         return;
      }
      res.status(httpStatus.OK).json({ message: '이메일이 인증되었습니다.', status: 'success' });
   } catch (error) {
      console.error('❌ 이메일 인증 중 오류 발생:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '이메일 인증 실패', error });
   }
};

export const emailLogin = async (req: Request, res: Response): Promise<void> => {
   try {
      const { email, password } = req.body;
      const tokens = await handleEmailLogin({ email, password });

      res.status(httpStatus.OK).json(tokens);
   } catch (error) {
      res.status(httpStatus.UNAUTHORIZED).json({ message: error });
   }
};

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
