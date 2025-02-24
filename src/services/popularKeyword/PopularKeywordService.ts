import PopularKeywordRepository from '../../repositories/popularKeyword/PopularKeywordRepository';

class PopularKeywordService {
   /**
    * 검색어 저장 비즈니스 로직
    * @param keyword 검색어
    */
   async saveKeyword(keyword: string) {
      if (!keyword || keyword.trim() === '') {
         throw new Error('검색어를 입력해야 합니다.');
      }

      return await PopularKeywordRepository.saveKeyword(keyword);
   }

   /**
    * 인기 검색어 조회 비즈니스 로직
    */
   async getPopularKeywords() {
      return await PopularKeywordRepository.getPopularKeywords();
   }
}

export default new PopularKeywordService();
