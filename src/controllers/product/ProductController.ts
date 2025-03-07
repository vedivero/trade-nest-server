import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ProductService from '../../services/product/ProductService';
import { JwtPayload } from 'jsonwebtoken';
import { CustomJwtPayload } from '../../middleware/AuthMiddleware';

class ProductController {
   /**
    * 모든 상품 조회
    * @route GET /product/products
    */
   async getProducts(req: Request, res: Response): Promise<void> {
      try {
         const userId = (req.user as JwtPayload & { id: number })?.id;
         const products = await ProductService.getProducts();
         const favoritedProducts = userId ? await ProductService.getFavoritedProducts(userId) : [];
         res.status(httpStatus.OK).json({ products, favoritedProducts });
      } catch (error) {
         console.error('❌ 상품 조회 실패:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: '상품 조회 중 오류 발생',
         });
      }
   }

   /**
    * 상품 등록
    * POST /product/regist
    */
   async registProducts(req: Request, res: Response): Promise<void> {
      try {
         const productData = req.body;

         const product = await ProductService.registProduct(productData);
         if (!res.headersSent) {
            res.status(httpStatus.CREATED).json({ message: '상품 등록 성공', product });
         }
      } catch (error) {
         console.error('❌ 상품 등록 실패:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '상품 등록 중 오류 발생' });
      }
   }

   /**
    * 상품 상세 조회
    * @route GET /product/:id
    */
   async getProductById(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const userId = (req.user as JwtPayload & { id: number })?.id || null;

         const product = await ProductService.getProductById(Number(id), userId ?? undefined);
         res.status(httpStatus.OK).json(product);
      } catch (error) {
         if (error === 'Product not found') {
            res.status(httpStatus.NOT_FOUND).json({ message: error });
         }
         console.error('❌ 상품 상세조회 실패:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '서버 에러 - 상품 상세정보 조회' });
      }
   }

   /**
    * 상품 찜하기
    * @route POST /favorite/:id
    */
   async addFavorite(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const userId = (req.user as JwtPayload & { id: number })?.id;
         if (!userId) {
            res.status(httpStatus.UNAUTHORIZED).json({ message: '로그인이 필요합니다.' });
         }
         await ProductService.addFavorite(userId, Number(id));
         res.status(httpStatus.OK).json({ message: '찜하기 완료' });
      } catch (error) {
         console.error('찜하기 실패:', error);
         if (!res.headersSent) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '찜 목록에 추가 실패' });
         }
      }
   }

   /**
    * 상품 찜하기 삭제
    * @route DELETE /favorite/:id
    */
   async removeFavorite(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const userId = (req.user as JwtPayload & { id: number })?.id;

         if (!userId) {
            res.status(httpStatus.UNAUTHORIZED).json({ message: '로그인이 필요합니다.' });
         }
         await ProductService.removeFavorite(userId, Number(id));
         res.status(httpStatus.OK).json({ message: '찜하기 취소 성공' });
      } catch (error) {
         console.error('찜 취소 실패:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: '찜 취소 실패' });
      }
   }

   /**
    * 마이페이지 - 해당 회원의 전체 상품 조회
    * @route GET /mypage/products/all
    */
   async getUserProducts(req: Request, res: Response): Promise<void> {
      try {
         const userId = (req.user as JwtPayload & { id: number })?.id;
         if (!userId) {
            res.status(httpStatus.UNAUTHORIZED).json({
               message: '로그인이 필요합니다.',
            });
         }

         const products = await ProductService.getUserProducts(userId);
         res.status(httpStatus.OK).json({ products });
      } catch (error) {
         console.error('❌ 회원의 전체 상품 조회 실패:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: '회원의 전체 상품 조회 중 오류 발생',
         });
      }
   }

   /**
    * 마이페이지 - 해당 회원의 상태별 상품 조회
    * @route GET /mypage/products/:status
    */
   async getUserProductsByStatus(req: Request, res: Response): Promise<void> {
      try {
         const userId = (req.user as JwtPayload & { id: number })?.id;
         const status = req.params.status;

         if (!userId) {
            res.status(httpStatus.UNAUTHORIZED).json({
               message: '로그인이 필요합니다.',
            });
         }

         const validStatuses = ['available', 'reserved', 'completed'];
         if (!validStatuses.includes(status)) {
            res.status(httpStatus.BAD_REQUEST).json({
               message: '잘못된 상태 값입니다.',
            });
         }

         const products = await ProductService.getUserProductsByStatus(userId, status);
         res.status(httpStatus.OK).json({ products });
      } catch (error) {
         console.error('❌ 회원의 상태별 상품 조회 실패:', error);
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: '회원의 상태별 상품 조회 중 오류 발생',
         });
      }
   }

   /**
    * 상품 상태 업데이트 (판매중 / 판매중지 / 삭제)
    * @route PATCH /product/mypage/product/:id/status
    */
   async updateProductStatus(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;
         const { status } = req.body;

         // 상태 값 검증
         const allowedStatuses = ['available', 'stopped', 'deleted'];
         if (!allowedStatuses.includes(status)) {
            if (!res.headersSent) {
               res.status(httpStatus.BAD_REQUEST).json({
                  message: `잘못된 상태값입니다. (${allowedStatuses.join(', ')} 중 하나여야 합니다.)`,
               });
            }
         }

         await ProductService.updateProductStatus(Number(id), status as 'available' | 'stopped' | 'deleted');

         if (!res.headersSent) {
            res.status(httpStatus.OK).json({ message: `상품 상태가 '${status}'로 변경되었습니다.` });
         }
      } catch (error) {
         console.error('❌ 상품 상태 업데이트 실패:', error);
         if (!res.headersSent) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
               message: '상품 상태 업데이트 중 오류가 발생했습니다.',
            });
         }
      }
   }
}

export default new ProductController();
