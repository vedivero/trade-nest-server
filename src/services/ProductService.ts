import { IProduct } from '../Model/Product';
import { createProduct, findAllProducts } from '../repositories/ProductRepository';

export const getAllProducts = async (): Promise<IProduct[]> => {
   return await findAllProducts();
};

export const registProduct = async (productData: Partial<IProduct>): Promise<IProduct> => {
   if (!productData.product_nm || !productData.product_price) {
      throw new Error('상품 이름과 가격은 필수로 입력해야 합니다.');
   }
   return await createProduct(productData);
};
