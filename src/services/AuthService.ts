<<<<<<< Updated upstream
import { IUser } from '../Model/User';
import { createUser, findUserBySocialId } from '../repositories/UserRepository';
=======
import User, { IUser } from '../Model/User';
import { createUser, findUserByEmail, findUserBySocialId } from '../repositories/UserRepository';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

dotenv.config();
>>>>>>> Stashed changes

interface SocialLoginData {
   social_id: string;
   social_provider: string;
   email?: string;
   nickname: string;
   profile_image?: string;
}

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
   const existingUser = await findUserByEmail(email);

   if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다.');
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

export const verifyEmailToken = async (token: string): Promise<string> => {
   const user = await User.findOne({ emailToken: token });

   if (!user) {
      return 'invalid';
   }

   if (user.verified) {
      return 'already-verified';
   }

   user.verified = true;
   user.emailToken = null;
   await user.save();

   return 'success';
};

export const handleEmailLogin = async ({ email, password }: { email: string; password: string }) => {
   const user = await findUserByEmail(email);

   if (!user) {
      throw new Error('존재하지 않는 사용자입니다.');
   }

   if (!user.verified) {
      throw new Error('이메일 인증이 필요합니다.');
   }

   const isValidPassword = await bcrypt.compare(password, user.password!);
   if (!isValidPassword) {
      throw new Error('비밀번호가 올바르지 않습니다.');
   }

   return generateTokens(user);
};

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
