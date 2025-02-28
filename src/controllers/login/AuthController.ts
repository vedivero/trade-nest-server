import { Request, Response } from 'express';
import {
   checkUserForResetPassword,
   handleEmailLogin,
   handleEmailSignUp,
   verifyEmailToken,
} from '../../services/login/AuthService';
import httpStatus from 'http-status';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export const emailSignUp = async (req: Request, res: Response): Promise<void> => {
   try {
      const { email, password, nickname } = req.body;

      if (!email || !password || !nickname) {
         res.status(httpStatus.BAD_REQUEST).json({ message: '필수 정보를 입력해 주세요.' });
      }

      await handleEmailSignUp({ email, password, nickname });
      res.status(httpStatus.OK).json({
         message: '해당 이메일 주소로 인증 메일을 발송하였습니다. \n메일을 확인해 주세요.',
      });
   } catch (error: any) {
      console.error('❌ 이메일 회원가입 중 오류 발생:', error);

      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage === '이미 가입된 이메일입니다.') {
         res.status(httpStatus.CONFLICT).json({ message: errorMessage });
         return;
      }

      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
         message: '회원가입 처리 중 오류가 발생했습니다.',
         error: errorMessage,
      });
   }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
   try {
      const emailToken = req.query.token;

      if (!emailToken) {
         console.log('❌ emailToken이 없습니다.');
         res.status(httpStatus.BAD_REQUEST).json({
            message: '유효하지 않은 요청입니다. emailToken이 누락되었습니다.',
         });
         return;
      }

      const user = await verifyEmailToken(emailToken as string);

      if (!user) {
         res.status(httpStatus.BAD_REQUEST).json({ message: '유효하지 않은 토큰입니다.' });
         return;
      }

      const token = jwt.sign(
         { id: user.id, user_id: user.user_id, email: user.email },
         process.env.JWT_ACCESS_SECRET_KEY as string,
         {
            expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRATION || '1h'),
         },
      );

      const filteredUser = {
         user_id: user.user_id,
         email: user.email,
         nickname: user.nickname,
      };

      res.cookie('accessToken', token);

      res.cookie('userInfo', JSON.stringify(filteredUser), {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         maxAge: 60 * 60 * 1000,
      });

      res.status(httpStatus.OK).json({
         message: '이메일이 인증되었습니다.',
         status: 'success',
         user: filteredUser,
      });
   } catch (error) {
      console.error('❌ 이메일 인증 중 오류 발생:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '이메일 인증 실패', error });
   }
};

export const emailLogin = async (req: Request, res: Response): Promise<void> => {
   try {
      const { email, password } = req.body;

      const { token, user } = await handleEmailLogin({ email, password });

      if (!token || !user) {
         res.status(httpStatus.UNAUTHORIZED).json({ message: '로그인 실패: 올바른 정보를 입력하세요.' });
      }

      const filteredUser = {
         id: user.id,
         user_id: user.user_id,
         email: user.email,
         nickname: user.nickname,
      };

      res.cookie('accessToken', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         maxAge: 24 * 60 * 60 * 1000, // 1일
      });

      res.cookie('userInfo', JSON.stringify(filteredUser), {
         httpOnly: false,
         secure: process.env.NODE_ENV === 'production',
         maxAge: 24 * 60 * 60 * 1000, // 1일
      });

      console.log('✅ 로그인 성공:', filteredUser);

      res.status(httpStatus.OK).json({
         message: '로그인 성공',
         status: 'success',
         user: filteredUser,
      });
   } catch (error) {
      console.error('❌ 로그인 중 오류 발생:', error);
      res.status(httpStatus.UNAUTHORIZED).json({ message: error || '로그인 실패' });
   }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
   try {
      res.clearCookie('accessToken', { path: '/' });
      res.clearCookie('userInfo', { path: '/' });

      res.status(httpStatus.OK).json({
         message: '로그아웃 성공',
      });
   } catch (error) {
      console.error('❌ 로그아웃 중 오류 발생:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
         message: '로그아웃 실패',
         error,
      });
   }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
   try {
      const { email } = req.body;

      checkUserForResetPassword({ email });
      res.status(httpStatus.OK).json({ message: '비밀번호 초기화 완료' });
   } catch (error) {
      console.error('❌ 로그아웃 중 오류 발생:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
         message: '비밀번호 초기화 실패',
         error,
      });
   }
};
