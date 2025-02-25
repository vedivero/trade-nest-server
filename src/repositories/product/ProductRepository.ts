import Product from '../../Model/Product';

/**
 * 모든 상품 조회
 */
export const findAllProducts = async (): Promise<Product[]> => {
   try {
      return await Product.findAll();
   } catch (error) {
      console.error('❌ 오류 발생 - 상품 조회:', error);
      throw new Error('상품 조회 실패');
   }
};

/**
 * 상품 등록
 */
export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
   try {
      return await Product.create(productData);
   } catch (error) {
      console.error('❌ 오류 발생 - 상품 등록:', error);
      throw new Error('상품 등록 실패');
   }
};
