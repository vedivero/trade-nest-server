import express from 'express';
import { getProducts, registProducts } from '../controllers/ProductController';

const router = express.Router();

router.get('/products', getProducts);
router.post('/regist', registProducts);

export default router;
