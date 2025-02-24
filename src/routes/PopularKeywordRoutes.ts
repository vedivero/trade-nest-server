import { Router } from 'express';
import PopularKeywordController from '../controllers/popularKeyword/PopularKeywordController';

const router = Router();

router.get('/', PopularKeywordController.saveKeyword);
router.get('/popular', PopularKeywordController.getPopularKeywords);

export default router;
