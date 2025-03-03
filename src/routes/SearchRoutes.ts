import { Router } from 'express';
import PopularKeywordController from '../controllers/search/SearchController';
import { optionalVerifyToken } from '../middleware/AuthMiddleware';

const router = Router();

router.get('/saveKeyword', PopularKeywordController.saveKeyword);
router.get('/getPopularKeywords', PopularKeywordController.getPopularKeywords);
router.get('/searchProducts', optionalVerifyToken, PopularKeywordController.getProductsBySearchKeyword);

export default router;
