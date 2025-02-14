export interface SocialUserInfo {
   sub: string; // 고유 ID (소셜마다 다름)
   email: string; // 이메일
   name: string; // 사용자 이름
   picture?: string; // 프로필 이미지
}
