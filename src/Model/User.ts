import mongoose, { Schema, Document } from 'mongoose';

// 사용자 인터페이스
export interface IUser extends Document {
   user_id: string; // 사용자 고유 ID
   social_id: string; // 소셜 로그인 ID
   social_provider: string; // 소셜 로그인 제공자 (naver, kakao, google)
   email?: string; // 이메일 (선택적)
   nickname: string; // 사용자 닉네임
   profile_image: string; // 프로필 이미지 URL
   reg_date: Date; // 가입 날짜
   addr?: string; // 사용자 주소 (선택적)
   rating?: number; // 사용자 평점 (선택적, 기본값 0)
}

// 사용자 문서 타입 정의
export interface IUserDocument extends IUser, Document {}

// 사용자 스키마 정의
const UserSchema: Schema<IUserDocument> = new Schema<IUser>({
   user_id: { type: String, required: true, unique: true }, // 사용자 고유 ID
   social_id: { type: String, required: true }, // 소셜 로그인 ID
   social_provider: { type: String, required: true }, // 소셜 로그인 제공자
   email: { type: String }, // 이메일 (선택적)
   nickname: { type: String, required: true }, // 사용자 닉네임
   profile_image: { type: String }, // 프로필 이미지 URL
   reg_date: { type: Date, default: Date.now }, // 가입 날짜 (기본값: 현재 시간)
   addr: { type: String }, // 사용자 주소 (선택적)
   rating: { type: Number, default: 0 }, // 사용자 평점 (기본값: 0)
});

// 모델 생성 및 내보내기
export default mongoose.model<IUser>('User', UserSchema);
