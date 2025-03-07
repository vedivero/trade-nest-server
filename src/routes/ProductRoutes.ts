import express from 'express';
import { optionalVerifyToken, verifyToken } from '../middleware/AuthMiddleware';
import ProductController from '../controllers/product/ProductController';

const router = express.Router();

// 전체 상품
router.get('/products', optionalVerifyToken, ProductController.getProducts);
router.post('/regist', verifyToken, ProductController.registProducts);
router.get('/:id', ProductController.getProductById);
router.post('/favorite/:id', verifyToken, ProductController.addFavorite);
router.delete('/favorite/:id', verifyToken, ProductController.removeFavorite);

// 마이페이지 - 상품 관리 탭
router.get('/mypage/products/all', verifyToken, ProductController.getUserProducts);
router.get('/mypage/products/:status', verifyToken, ProductController.getUserProductsByStatus);
router.patch('/mypage/product/:id/status', verifyToken, ProductController.updateProductStatus);

export default router;
