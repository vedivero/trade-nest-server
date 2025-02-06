import { IUser } from '../Model/User';
import {
   createUser,
   findUserByEmail,
   findUserBySocialId,
   updateUserVerification,
} from '../repositories/UserRepository';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

dotenv.config();

interface SocialLoginData {
   social_id: string;
   social_provider: string;
   email?: string;
   nickname: string;
   profile_image?: string;
}

export const handleSocialLogin = async (loginData: SocialLoginData): Promise<IUser> => {
   const { social_id, social_provider } = loginData;

   try {
      let user = await findUserBySocialId(social_id, social_provider);

      if (!user) {
         user = await createUser({
            user_id: `user_${Date.now()}`,
            ...loginData,
         });
      }
      return user;
   } catch (error) {
      console.error('❌ 소셜 로그인 처리 중 오류 발생:', error);
      throw new Error('소셜 로그인 처리 실패');
   }
};

export const generateTokens = (user: IUser) => {
   const payload = {
      user_id: user.user_id,
      social_provider: user.social_provider,
   };

   const accessSecret = process.env.JWT_ACCESS_SECRET_KEY || '';
   const refreshSecret = process.env.JWT_REFRESH_SECRET_KEY || '';

   if (!accessSecret || !refreshSecret) {
      throw new Error('JWT 비밀키가 설정되지 않았습니다.');
   }

   const accessToken = jwt.sign(payload, accessSecret, { expiresIn: '1h' });
   const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

   return { accessToken, refreshToken };
};

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
   },
});

export const handleEmailSignUp = async ({
   email,
   password,
   nickname,
}: {
   email: string;
   password: string;
   nickname: string;
}) => {
   if (await findUserByEmail(email)) {
      throw new Error('이미 가입된 이메일입니다.');
   }

   const hashedPassword = await bcrypt.hash(password, 10);
   const emailToken = crypto.randomBytes(32).toString('hex');

   await createUser({
      user_id: `user_${Date.now()}`,
      email,
      password: hashedPassword,
      nickname,
      social_provider: 'self',
      social_id: email,
      verified: false,
      emailToken,
   });

   const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${emailToken}`;

   await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: '이메일 인증 요청',
      html: `<p>이메일 인증을 위해 아래 링크를 클릭해주세요:</p>
      <a href="${verifyLink}">${verifyLink}</a>`,
   });
};

export const verifyEmailToken = async (token: string): Promise<boolean> => {
   return await updateUserVerification(token);
};

export const handleEmailLogin = async ({ email, password }: { email: string; password: string }) => {
   const user = await findUserByEmail(email);

   if (!user) throw new Error('존재하지 않는 사용자입니다.');
   if (!user.verified) throw Error('이메일 인증이 필요합니다.');

   const isValidPassword = await bcrypt.compare(password, user.password);
   if (!isValidPassword) throw new Error('비밀번호가 일치하지 않습니다');

   return generateTokens(user);
};
