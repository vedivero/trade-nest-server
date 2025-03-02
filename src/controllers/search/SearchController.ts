import { Request, Response } from 'express';
import SearchService from '../../services/search/SearchService';
import httpStatus from 'http-status';

class SearchController {
   /**
    * 검색어 저장 API (`GET /search/saveKeyword={keyword}`)
    */
   saveKeyword = async (req: Request, res: Response): Promise<void> => {
      try {
         const { keyword } = req.query;
         console.log('검색한 키워드 : ', keyword);
         if (!keyword || typeof keyword !== 'string') {
            res.status(httpStatus.BAD_REQUEST).json({ success: false, message: '검색어가 필요합니다.' });
            return;
         }

         const savedKeyword = await SearchService.saveKeyword(keyword);
         res.status(httpStatus.OK).json({ success: true, data: savedKeyword });
      } catch (error) {
         console.error('검색어 저장 실패:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: '서버 오류 발생' });
      }
   };

   /**
    * 인기 검색어 조회 API (`GET /search/getPopularKeywords`)
    */
   getPopularKeywords = async (req: Request, res: Response): Promise<void> => {
      try {
         const keywords = await SearchService.getPopularKeywords();
         res.status(httpStatus.OK).json({ success: true, data: keywords });
      } catch (error) {
         console.error('인기 검색어 조회 실패:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: '서버 오류 발생' });
      }
   };

   /**
    * 상품 키워드 검색 API (`GET /search/searchProducts={searchKeyword}`)
    */
   getProductsBySearchKeyword = async (req: Request, res: Response): Promise<void> => {
      try {
         const userId = (req.user as { id?: number })?.id || null;
         const { searchKeyword } = req.query as { searchKeyword: string };

         const { products, favoritedProductIds } = await SearchService.getProductsWithFavoriteStatus(
            searchKeyword,
            userId,
         );
         res.status(httpStatus.OK).json({
            products,
            favoritedProducts: favoritedProductIds,
         });
      } catch (error) {
         console.error('상품 검색 실패:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: '서버 오류 발생' });
      }
   };
}

export default new SearchController();
