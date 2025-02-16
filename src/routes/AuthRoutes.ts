import express from 'express';
import { emailLogin, emailSignUp, logout, resetPassword, verifyEmail } from '../controllers/AuthController';

const router = express.Router();

router.post('/signup', emailSignUp);
router.get('/verify-email', verifyEmail);
router.post('/login', emailLogin);
router.post('/logout', logout);
router.post('/resetPassword', resetPassword);

export default router;
