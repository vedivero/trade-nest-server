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
}

export default new ProductService();
