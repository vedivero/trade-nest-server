import Product from '../../models/Product';
import Favorite from '../../models/Favorite';
import { Op, Sequelize } from 'sequelize';

class ProductRepository {
   /**
    * 모든 상품 조회
    */
   async findAllProducts(): Promise<Product[]> {
      try {
         return await Product.findAll({
            order: [['product_reg_date', 'DESC']],
         });
      } catch (error) {
         console.error('❌ 오류 발생 - 상품 조회:', error);
         throw new Error('상품 조회 실패');
      }
   }

   /**
    * 해당 회원의 찜한 상품 조회
    */
   async findAllFavoritedProducts(userId?: number) {
      try {
         return await Favorite.findAll({
            where: { user_id: userId },
         });
      } catch (error) {
         console.error('❌ 찜한 상품 조회 실패:', error);
         return [];
      }
   }

   /**
    * 사용자가 특정 상품을 찜했는지 확인
    */
   async isFavorited(userId: number, productId: number): Promise<boolean> {
      try {
         const favorite = await Favorite.findOne({
            where: { user_id: userId, product_id: productId },
         });

         return !!favorite;
      } catch (error) {
         console.error('❌ 찜 상태 확인 실패:', error);
         return false;
      }
   }
   /**
    *  상품 등록
    */
   async createProduct(productData: Partial<Product>): Promise<Product> {
      try {
         return await Product.create(productData);
      } catch (error) {
         console.error('❌ 오류 발생 - 상품 등록:', error);
         throw new Error('상품 등록 실패');
      }
   }

   /**
    * 상품 상세조회
    */
   async getProductById(id: number): Promise<Product | null> {
      try {
         const product = await Product.findByPk(id);
         console.log('🔍 리포지토리에서 조회된 product:', product);
         return product;
      } catch (error) {
         throw new Error('오류 - 데이터 베이스');
      }
   }

   /**
    * 찜하기 추가
    */
   async addFavorite(userId: number, productId: number) {
      await Favorite.create({ user_id: userId, product_id: productId });
      await Product.increment('favorite_cnt', {
         where: { id: productId },
      });
   }

   /**
    * 찜하기 삭제
    */
   async removeFavorite(userId: number, productId: number) {
      const deleted = await Favorite.destroy({
         where: { user_id: userId, product_id: productId },
      });
      if (deleted) {
         await Product.decrement('favorite_cnt', {
            where: { id: productId, favorite_cnt: { [Op.gt]: 0 } },
         });
      }
   }
}

export default new ProductRepository();
