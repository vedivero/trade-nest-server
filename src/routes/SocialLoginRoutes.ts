import { Router } from 'express';
import { NaverAuthController } from '../controllers/socialLogin/NaverLoginController';
import { KakaoAuthController } from '../controllers/socialLogin/KakaoLoginController';
import { GoogleAuthController } from '../controllers/socialLogin/GoogleAuthController';

const router = Router();

router.get('/naver', NaverAuthController.naverLogin);
router.get('/naver/callback', NaverAuthController.naverCallback);

router.get('/kakao', KakaoAuthController.kakaoLogin);
router.get('/kakao/callback', KakaoAuthController.kakaoCallback);

router.get('/google', GoogleAuthController.googleLogin);
router.get('/google/callback', GoogleAuthController.googleCallback);
export default router;
