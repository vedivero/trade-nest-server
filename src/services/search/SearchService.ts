import SearchRepository from '../../repositories/search/SearchRepository';

class SearchService {
   /**
    * 검색어 저장 비즈니스 로직
    * @param keyword 검색어
    */
   async saveKeyword(keyword: string) {
      if (!keyword || keyword.trim() === '') {
         throw new Error('검색어를 입력해야 합니다.');
      }

      return await SearchRepository.saveKeyword(keyword);
   }

   /**
    * 인기 검색어 조회 비즈니스 로직
    */
   async getPopularKeywords() {
      return await SearchRepository.getPopularKeywords();
   }

   /**
    * 검색어에 따른 상품 목록 조회
    */
   async getProductsBySearchKeyword(searchKeyword: string) {
      const products = await SearchRepository.findProductsBySearchKeyword(searchKeyword);
      return products.map((product) => product.toJSON());
   }

   /**
    * 검색어에 따른 찜한 상품 객체 목록 조회
    */
   async getFavoritedProductsBySearchKeyword(searchKeyword: string, userId: number) {
      const favoritedProducts = await SearchRepository.findFavoritedProductsBySearchKeyword(
         searchKeyword,
         userId,
      );
      return favoritedProducts.map((product) => ({
         id: product.id,
         user_id: product.user_id,
         product_id: product.product_id,
      }));
   }
}

export default new SearchService();
