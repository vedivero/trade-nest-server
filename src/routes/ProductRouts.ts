import express from 'express';
import { getProducts, registProducts } from '../controllers/ProductController';
import { verifyToken } from '../middleware/AuthMiddleware';

const router = express.Router();

router.get('/products', getProducts);
router.post('/regist', verifyToken, registProducts);

export default router;
