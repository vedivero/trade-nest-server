import express from 'express';
import { verifyToken } from '../middleware/AuthMiddleware';
import UserController from '../controllers/user/UserController';

const router = express.Router();

router.get('/getUserInfo', verifyToken, UserController.getUserInfo);
router.post('/updateUserInfo', verifyToken, UserController.updateUserInfo);

export default router;
