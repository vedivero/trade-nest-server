import Product from '../../models/Product';
import ProductRepository from '../../repositories/product/ProductRepository';

class ProductService {
   /**
    * 상품 목록 조회
    */
   async getProducts() {
      const products = await ProductRepository.findAllProducts();
      return products.map((products) => products.toJSON());
   }

   async getFavoritedProducts(userId: number) {
      const isFavoritedProducts = await ProductRepository.findAllFavoritedProducts(userId);
      return isFavoritedProducts.map((products) => products.toJSON());
   }

   /**
    * 상품 등록
    */
   async registProduct(productData: Partial<Product>): Promise<Product> {
      if (!productData.product_nm || !productData.product_price) {
         throw new Error('상품 이름과 가격은 필수로 입력해야 합니다.');
      }
      return await ProductRepository.createProduct(productData);
   }

   /**
    * 상품 상세조회
    */
   async getProductById(id: number, userId?: number) {
      const product = await ProductRepository.getProductById(id);

      if (!product) {
         throw new Error('Product not found');
      }

      let isFavorited = false;
      if (userId) {
         isFavorited = await ProductRepository.isFavorited(userId, id);
      }
      console.log('🔍 서비스에서 반환하는 product:', product.toJSON(), 'isFavorited:', isFavorited);
      return { ...product.toJSON(), isFavorited };
   }

   /**
    * 찜하기
    */
   async addFavorite(userId: number, productId: number) {
      return await ProductRepository.addFavorite(userId, productId);
   }

   /**
    * 찜하기 삭제
    */
   async removeFavorite(userId: number, productId: number) {
      return await ProductRepository.removeFavorite(userId, productId);
   }

   /**
    * 해당 회원의 전체 상품 조회
    */
   async getUserProducts(userId: number) {
      const products = await ProductRepository.findUserProducts(userId);
      return products.map((product) => product.toJSON());
   }

   /**
    * 해당 회원의 상태별 상품 조회
    */
   async getUserProductsByStatus(userId: number, status: string) {
      const products = await ProductRepository.findUserProductsByStatus(userId, status);
      return products.map((product) => product.toJSON());
   }

   async updateProductStatus(productId: number, status: 'available' | 'stopped'): Promise<void> {
      try {
         const product = await ProductRepository.findProductById(productId);
         if (!product) {
            throw new Error('상품을 찾을 수 없습니다.');
         }

         await ProductRepository.updateProductStatus(productId, status);
      } catch (error) {
         console.error('❌ 상품 상태 업데이트 실패:', error);
         throw new Error('상품 상태 업데이트 중 오류가 발생했습니다.');
      }
   }

   /**
    * 상품 삭제
    */
   async deleteProduct(productId: number): Promise<void> {
      await ProductRepository.deleteProduct(productId);
   }
}

export default new ProductService();
