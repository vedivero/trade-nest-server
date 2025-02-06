import express from 'express';
import { emailLogin, emailSignUp, socialLogin, verifyEmail } from '../controllers/AuthController';

const router = express.Router();

router.post('/login', socialLogin);
router.post('/register', emailSignUp);
router.get('/verify-email', verifyEmail);
router.post('/email-login', emailLogin);

export default router;
