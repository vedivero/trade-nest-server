import express from 'express';
import { emailLogin, emailSignUp, verifyEmail } from '../controllers/AuthController';

const router = express.Router();

router.post('/signup', emailSignUp);
router.get('/verify-email', verifyEmail);
router.post('/login', emailLogin);

export default router;
