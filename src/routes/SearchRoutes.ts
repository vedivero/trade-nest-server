import { Router } from 'express';
import PopularKeywordController from '../controllers/search/SearchController';

const router = Router();

router.get('/saveKeyword', PopularKeywordController.saveKeyword);
router.get('/getPopularKeywords', PopularKeywordController.getPopularKeywords);
router.get('/searchProducts', PopularKeywordController.getProductsBySearchKeyword);

export default router;
