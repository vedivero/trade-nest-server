import { Op } from 'sequelize';
import PopularKeyword from '../../models/PopularKeyword';
import Product from '../../models/Product';
import Favorite from '../../models/Favorite';

interface ProductSearchResult {
   products: Product[];
   favoritedProductIds: number[];
}

class SearchRepositoryRepository {
   /**
    * 검색어를 저장하거나 검색 횟수를 증가시키는 메서드
    * @param keyword 검색어
    */
   async saveKeyword(keyword: string): Promise<PopularKeyword> {
      try {
         const [popularKeyword, created] = await PopularKeyword.findOrCreate({
            where: { keyword },
            defaults: { search_count: 1 },
         });

         if (!created) {
            await popularKeyword.increment('search_count');
            await popularKeyword.update({ last_searched: new Date() });
         }

         return popularKeyword;
      } catch (error) {
         console.error('인기 검색어 저장 오류:', error);
         throw new Error('데이터베이스 처리 중 오류 발생');
      }
   }

   /**
    * 인기 검색어 TOP 10 조회
    */
   async getPopularKeywords(): Promise<PopularKeyword[]> {
      try {
         return await PopularKeyword.findAll({
            order: [['search_count', 'DESC']],
            limit: 7,
         });
      } catch (error) {
         console.error('인기 검색어 조회 오류:', error);
         throw new Error('인기 검색어를 불러오는 중 오류 발생');
      }
   }

   /**
    * 검색어에 해당하는 상품 목록 조회
    */
   async findProductsBySearchKeyword(searchKeyword: string) {
      try {
         return await Product.findAll({
            where: {
               product_nm: { [Op.like]: `%${searchKeyword}%` },
            },
            order: [['product_reg_date', 'DESC']],
         });
      } catch (error) {
         console.error('❌ 오류 발생 - 검색어로 상품 조회:', error);
         throw new Error('검색어로 상품 조회 실패');
      }
   }

   /**
    * 검색어에 해당하는 찜한 상품 객체 조회
    */
   async findFavoritedProductsBySearchKeyword(searchKeyword: string, userId: number) {
      try {
         return await Favorite.findAll({
            attributes: ['id', 'user_id', 'product_id'],
            include: [
               {
                  model: Product,
                  attributes: [],
                  where: { product_nm: { [Op.like]: `%${searchKeyword}%` } },
               },
            ],
            where: { user_id: userId },
            raw: true,
         });
      } catch (error) {
         console.error('❌ 오류 발생 - 검색어로 찜한 상품 조회:', error);
         throw new Error('검색어로 찜한 상품 조회 실패');
      }
   }
}

export default new SearchRepositoryRepository();
