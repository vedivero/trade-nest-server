import Product from '../Model/Product';
import { IProduct } from '../Model/Product';

export const findAllProducts = async (): Promise<IProduct[]> => {
   try {
      return await Product.find();
   } catch (error) {
      console.error('❌ 오류 발생 - 상품 조회  : ', error);
      throw new Error('상품 조회 실패');
   }
};

export const createProduct = async (productData: Partial<IProduct>): Promise<IProduct> => {
   try {
      const product = new Product(productData);
      return await product.save();
   } catch (error) {
      console.error('❌ 오류 발생 - 상품 등록 : ', error);
      throw new Error('상품 등록 실패');
   }
};
