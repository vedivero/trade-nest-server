import express from 'express';
import { emailLogin, emailSignUp, socialLogin, verifyEmail } from '../controllers/AuthController';

const router = express.Router();

router.post('/signup', emailSignUp);
router.get('/verify-email', verifyEmail);
router.post('/login', emailLogin);
router.post('/social-login', socialLogin);

export default router;
