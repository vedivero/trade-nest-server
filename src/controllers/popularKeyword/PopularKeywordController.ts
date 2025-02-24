import { Request, Response } from 'express';
import PopularKeywordService from '../../services/popularKeyword/PopularKeywordService';
import httpStatus from 'http-status';

class PopularKeywordController {
   /**
    * 검색어 저장 API (`GET /popular-keyword?keyword=example`)
    */
   saveKeyword = async (req: Request, res: Response): Promise<void> => {
      try {
         const { keyword } = req.query;
         if (!keyword || typeof keyword !== 'string') {
            res.status(httpStatus.BAD_REQUEST).json({ success: false, message: '검색어가 필요합니다.' });
            return;
         }

         const savedKeyword = await PopularKeywordService.saveKeyword(keyword);
         res.status(httpStatus.OK).json({ success: true, data: savedKeyword });
      } catch (error) {
         console.error('❌ 검색어 저장 실패:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: '서버 오류 발생' });
      }
   };

   /**
    * 인기 검색어 조회 API (`GET /popular-keyword/popular`)
    */
   getPopularKeywords = async (req: Request, res: Response): Promise<void> => {
      try {
         const keywords = await PopularKeywordService.getPopularKeywords();
         res.status(httpStatus.OK).json({ success: true, data: keywords });
      } catch (error) {
         console.error('❌ 인기 검색어 조회 실패:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: '서버 오류 발생' });
      }
   };
}

export default new PopularKeywordController();
