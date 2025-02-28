import { Op, Sequelize } from 'sequelize';
import PopularKeyword from '../../models/PopularKeyword';
import Product from '../../models/Product';

class PopularKeywordRepository {
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
            limit: 10,
         });
      } catch (error) {
         console.error('인기 검색어 조회 오류:', error);
         throw new Error('인기 검색어를 불러오는 중 오류 발생');
      }
   }

   /**
    * 상품 키워드 DB 검색
    */
   async getProductsBySearchKeyword(keyword: string): Promise<Product[]> {
      try {
         const trimmedKeyword = keyword.trim();

         const products = await Product.findAll({
            where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('product_nm')), {
               [Op.like]: `%${trimmedKeyword.toLowerCase()}%`,
            }),
            order: [['product_reg_date', 'DESC']],
            logging: console.log,
         });

         return products;
      } catch (error) {
         console.error('상품 검색 오류:', error);
         throw new Error('상품 검색 오류 발생');
      }
   }
}

export default new PopularKeywordRepository();
