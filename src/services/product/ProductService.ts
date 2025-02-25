import Product from '../../Model/Product';
import { createProduct, findAllProducts } from '../../repositories/product/ProductRepository';

/**
 *  모든 상품 조회
 */
export const getAllProducts = async (): Promise<Product[]> => {
   return await findAllProducts();
};

/**
 *  상품 등록
 */
export const registProduct = async (productData: Partial<Product>): Promise<Product> => {
   if (!productData.product_nm || !productData.product_price) {
      throw new Error('상품 이름과 가격은 필수로 입력해야 합니다.');
   }
   return await createProduct(productData);
};
