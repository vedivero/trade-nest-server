import express from 'express';
import { optionalVerifyToken, verifyToken } from '../middleware/AuthMiddleware';
import ProductController from '../controllers/product/ProductController';

const router = express.Router();

router.get('/products', optionalVerifyToken, ProductController.getProducts);
router.post('/regist', verifyToken, ProductController.registProducts);
router.get('/:id', ProductController.getProductById);
router.post('/favorite/:id', verifyToken, ProductController.addFavorite);
router.delete('/favorite/:id', verifyToken, ProductController.removeFavorite);
export default router;
