import Product from '../../Model/Product';
import ProductRepository from '../../repositories/product/ProductRepository';

class ProductService {
   /**
    * ✅ 모든 상품 조회
    */
   async getAllProducts(): Promise<Product[]> {
      return await ProductRepository.findAllProducts();
   }

   /**
    * ✅ 상품 등록
    */
   async registProduct(productData: Partial<Product>): Promise<Product> {
      if (!productData.product_nm || !productData.product_price) {
         throw new Error('상품 이름과 가격은 필수로 입력해야 합니다.');
      }
      return await ProductRepository.createProduct(productData);
   }
}

export default new ProductService();
