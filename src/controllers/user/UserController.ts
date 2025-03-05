import { Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserService from '../../services/user/UserService';

dotenv.config();

class UserController {
   async getUserInfo(req: Request, res: Response): Promise<void> {
      try {
         const userId = (req.user as JwtPayload & { id: number })?.id;
         const userInfo = await UserService.getUserInfo(userId);
         res.status(httpStatus.OK).json(userInfo);
      } catch (error) {
         console.error('회원 정보 조회 실패 : ', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '회원 정보 조회 실패' });
      }
   }

   async updateUserInfo(req: Request, res: Response): Promise<void> {
      try {
         const { password, location } = req.body;
         const userId = (req.user as JwtPayload & { id: number })?.id;
         await UserService.updateUserInfo(userId, password, location);
         res.status(httpStatus.OK).json({ message: '회원정보 업데이트 성공' });
      } catch (error) {
         console.error('회원 정보 업데이트 실패 : ', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '회원 정보 업데이트 실패' });
      }
   }
}

export default new UserController();
