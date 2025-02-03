import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { getAllProducts, registProduct } from '../services/ProductService';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
   try {
      const products = await getAllProducts();
      res.status(httpStatus.OK).json({ message: '상품 조회 성공', products });
   } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      return;
   }
};

export const registProducts = async (req: Request, res: Response): Promise<void> => {
   try {
      const productData = req.body;
      const product = await registProduct(productData);
      res.status(httpStatus.CREATED).json({ message: '상품 등록 성공', product });
   } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
   }
};
