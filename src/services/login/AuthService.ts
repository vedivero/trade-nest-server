import User from '../../models/User';
import {
   createUser,
   findUserByEmail,
   sendNewPassword,
   updateUserVerification,
} from '../../repositories/login/UserRepository';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

dotenv.config();

export const generateTokens = (user: User) => {
   const payload = {
      user_id: user.user_id,
      social_provider: user.social_provider,
   };

   const accessSecret = process.env.JWT_ACCESS_SECRET_KEY || '';
   const refreshSecret = process.env.JWT_REFRESH_SECRET_KEY || '';

   if (!accessSecret || !refreshSecret) {
      throw new Error('JWT 비밀키가 설정되지 않았습니다. .env파일을 확인해 주세요.');
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
   const existingUser = await findUserByEmail(email);
   if (existingUser) {
      throw new Error('이미 가입된 이메일입니다.');
   }

   const hashedPassword = await bcrypt.hash(password, 10);
   const emailToken = crypto.randomBytes(32).toString('hex');

   const userInfo = await createUser({
      user_id: `user_${Date.now()}`,
      email,
      password: hashedPassword,
      nickname,
      social_provider: 'self',
      social_id: email,
      verified: false,
      emailToken,
   });

   const verifyLink = `${process.env.FRONTEND_URL}/verify-email?emailToken=${emailToken}`;

   await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: '이메일 인증 요청',
      html: `<p>이메일 인증을 위해 아래 링크를 클릭해주세요:</p>
      <a href="${verifyLink}">${verifyLink}</a>`,
   });

   return userInfo;
};

export const verifyEmailToken = async (token: string): Promise<User | null> => {
   return await updateUserVerification(token);
};

export const handleEmailLogin = async ({ email, password }: { email: string; password: string }) => {
   const user = await findUserByEmail(email);

   if (!user) throw new Error('존재하지 않는 사용자입니다.');
   if (!user.verified) throw new Error('이메일 인증이 필요합니다.');

   const isValidPassword = await bcrypt.compare(password, user.password);
   if (!isValidPassword) throw new Error('비밀번호가 일치하지 않습니다');

   const token = generateTokens(user);

   return { token, user: { id: user.id, user_id: user.user_id, email: user.email, nickname: user.nickname } };
};

export const checkUserForResetPassword = async ({ email }: { email: string }) => {
   const result = await sendNewPassword(email);
   if (result) {
      const { user, newPassword } = result;
      await transporter.sendMail({
         from: process.env.EMAIL_ADDRESS,
         to: email,
         subject: '비밀번호 초기화',
         html: `<p>변경된 새로운 비밀번호</p>
               <p>${newPassword}</p>
               <p>변경된 새로운 비밀번호로 로그인 해주세요.</p>`,
      });
   }
};
