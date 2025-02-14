import { Router } from 'express';
import { NaverAuthController } from '../controllers/socialLogin/NaverLoginController';
import { KakaoAuthController } from '../controllers/socialLogin/KakaoLoginController';

const router = Router();

router.get('/naver', NaverAuthController.naverLogin);
router.get('/naver/callback', NaverAuthController.naverCallback);

router.get('/kakao', KakaoAuthController.kakaoLogin);
router.get('/kakao/callback', KakaoAuthController.kakaoCallback);

export default router;
