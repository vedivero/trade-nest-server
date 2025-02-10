import express from 'express';
import { emailLogin, emailSignUp, logout, verifyEmail } from '../controllers/AuthController';

const router = express.Router();

router.post('/signup', emailSignUp);
router.get('/verify-email', verifyEmail);
router.post('/login', emailLogin);
router.post('/logout', logout);

export default router;
