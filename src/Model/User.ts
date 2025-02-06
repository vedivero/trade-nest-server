import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
<<<<<<< Updated upstream
   user_id: string;
   social_id: string;
   social_provider: string;
   email?: string;
   nickname: string;
   profile_image: string;
   reg_date: Date;
   addr?: string;
   rating?: number;
=======
   user_id: string; // 사용자 고유 ID
   password?: string;
   social_id: string; // 소셜 로그인 ID
   social_provider: string; // 소셜 로그인 제공자 (naver, kakao, google)
   email?: string; // 이메일 (선택적)
   nickname: string; // 사용자 닉네임
   profile_image: string; // 프로필 이미지 URL
   reg_date: Date; // 가입 날짜
   addr?: string; // 사용자 주소 (선택적)
   rating?: number; // 사용자 평점 (선택적, 기본값 0)
   verified?: boolean; // 이메일 인증 여부
   emailToken?: string | null; // 이메일 인증 토큰큰
>>>>>>> Stashed changes
}

export interface IUserDocument extends IUser, Document {}

const UserSchema: Schema<IUserDocument> = new Schema<IUser>({
<<<<<<< Updated upstream
   user_id: { type: String, required: true, unique: true },
   social_id: { type: String, required: true },
   social_provider: { type: String, required: true },
   email: { type: String },
   nickname: { type: String, required: true },
   profile_image: { type: String },
   reg_date: { type: Date, defualt: Date.now },
   addr: { type: String },
   rating: { type: Number, default: 0 },
=======
   user_id: { type: String, required: true, unique: true }, // 사용자 고유 ID
   password: { type: String },
   social_id: { type: String, required: true }, // 소셜 로그인 ID
   social_provider: { type: String, required: true, default: 'self' }, // 소셜 로그인 제공자
   email: { type: String }, // 이메일 (선택적)
   nickname: { type: String, required: true }, // 사용자 닉네임
   profile_image: { type: String }, // 프로필 이미지 URL
   reg_date: { type: Date, default: Date.now }, // 가입 날짜 (기본값: 현재 시간)
   addr: { type: String }, // 사용자 주소 (선택적)
   rating: { type: Number, default: 0 }, // 사용자 평점 (기본값: 0),
   verified: { type: Boolean, default: false },
   emailToken: { type: String },
>>>>>>> Stashed changes
});

export default mongoose.model<IUser>('User', UserSchema);
