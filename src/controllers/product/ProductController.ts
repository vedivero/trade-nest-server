import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ProductService from '../../services/product/ProductService';

class ProductController {
   /**
    * ✅ 모든 상품 조회
    */
   async getProducts(req: Request, res: Response): Promise<void> {
      try {
         const products = await ProductService.getAllProducts();
         res.status(httpStatus.OK).json({ message: '상품 조회 성공', products });
      } catch (error) {
         console.error('❌ 상품 조회 실패:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '상품 조회 중 오류 발생' });
      }
   }

   /**
    * ✅ 상품 등록
    */
   async registProducts(req: Request, res: Response): Promise<void> {
      try {
         const productData = req.body;
         const product = await ProductService.registProduct(productData);
         res.status(httpStatus.CREATED).json({ message: '상품 등록 성공', product });
      } catch (error) {
         console.error('❌ 상품 등록 실패:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '상품 등록 중 오류 발생' });
      }
   }
}

export default new ProductController();
