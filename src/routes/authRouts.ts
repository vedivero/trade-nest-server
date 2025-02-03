import express from 'express';
import { socialLogin } from '../controllers/AuthController';

const router = express.Router();

router.post('/login', socialLogin);

export default router;
