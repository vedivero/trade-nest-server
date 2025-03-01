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
    * 상품 키워드 검색 비즈니스 로직
    */
   async getProductsWithFavoriteStatus(searchKeyword: string, userId: number | null) {
      return await SearchRepository.findProductsWithFavoriteStatus(searchKeyword, userId);
   }
}

export default new SearchService();
