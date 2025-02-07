import { Request, Response } from 'express';
import { handleEmailLogin, handleEmailSignUp, verifyEmailToken } from '../services/AuthService';
import httpStatus from 'http-status';
import dotenv from 'dotenv';
dotenv.config();

export const emailSignUp = async (req: Request, res: Response): Promise<void> => {
   try {
      const { email, password, nickname } = req.body;

      if (!email || !password || !nickname) {
         res.status(httpStatus.BAD_REQUEST).json({ message: '필수 정보를 입력해 주세요.' });
      }

      await handleEmailSignUp({ email, password, nickname });
      res.status(httpStatus.OK).json({ message: '해당 이메일 주소로 인증 메일을 전송하였습니다.' });
   } catch (error) {
      console.error('❌ 이메일 회원가입 중 오류 발생:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
         message: '회원가입 처리 중 오류가 발생했습니다.',
         error,
      });
   }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
   try {
      const { token } = req.query;
      const isVerified = await verifyEmailToken(token as string);

      if (!isVerified) {
         res.status(httpStatus.BAD_REQUEST).json({ message: '유효하지 않은 토큰입니다.' });
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
      console.error('❌ 로그인 중 오류 발생:', error);
      res.status(httpStatus.UNAUTHORIZED).json({ message: error });
   }
};
