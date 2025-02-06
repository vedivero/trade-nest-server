import { Request, Response } from 'express';
import {
   generateTokens,
   handleEmailLogin,
   handleEmailSignUp,
   handleSocialLogin,
   verifyEmailToken,
} from '../services/AuthService';
import httpStatus from 'http-status';
import dotenv from 'dotenv';
dotenv.config();

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

      const { accessToken, refreshToken } = generateTokens(user);

      res.cookie('refreshToken', refreshToken, {
         httpOnly: true, // XSS 공격 방지
         secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송
         sameSite: 'strict', // 동일 출처에서만 쿠키 전송
         maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      });

      res.status(httpStatus.OK).json({ message: '로그인 성공', accessToken, user });
   } catch (error) {
      console.error('❌ 요청 처리 중 오류 발생:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error || '서버 오류' });
   }
};

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
