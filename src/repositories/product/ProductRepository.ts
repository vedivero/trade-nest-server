import Product from '../../Model/Product';

class ProductRepository {
   /**
    * ✅ 모든 상품 조회
    */
   async findAllProducts(): Promise<Product[]> {
      try {
         return await Product.findAll();
      } catch (error) {
         console.error('❌ 오류 발생 - 상품 조회:', error);
         throw new Error('상품 조회 실패');
      }
   }

   /**
    * ✅ 상품 등록
    */
   async createProduct(productData: Partial<Product>): Promise<Product> {
      try {
         return await Product.create(productData);
      } catch (error) {
         console.error('❌ 오류 발생 - 상품 등록:', error);
         throw new Error('상품 등록 실패');
      }
   }
}

export default new ProductRepository();
