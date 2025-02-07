import { Router } from 'express';
import { SocialAuthController } from '../controllers/NaverLoginController';

const router = Router();

router.get('/naver', SocialAuthController.naverLogin);
router.get('/naver/callback', SocialAuthController.naverCallback);

export default router;
