import express from 'express';
import { verifyToken } from '../middleware/AuthMiddleware';
import ProductController from '../controllers/product/ProductController';

const router = express.Router();

router.get('/products', ProductController.getProducts);
router.post('/regist', verifyToken, ProductController.registProducts);

export default router;
