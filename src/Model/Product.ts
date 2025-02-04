import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
   product_no: string; // 상품 번호
   product_nm: string; // 상품 이름
   product_price: string; // 상품 가격
   product_desc: string; // 상품 상세 설명
   product_condition: string; // 상품 상태 (new, used, damaged)
   product_img: string; // 상품 이미지 URL
   product_reg_date: Date; // 상품 등록일
   expiry_date: Date; // 등록 만료일
   view_cnt: number; // 조회 수
   favorite_cnt: number; // 좋아요 수
   seller_id: mongoose.Schema.Types.ObjectId; // 판매자 ID (User 참조)
   trade_loc: string; // 거래 희망 장소
   trade_stuats: string; // 거래 상태 (available, reserved, completed)
   trade_complete_date?: Date; // 거래 완료 날짜 (선택적)
   trade_method: string; // 거래 방식 (e.g., 직거래, 택배 거래)
   buyer_id?: mongoose.Schema.Types.ObjectId; // 구매자 ID (User 참조, 선택적)
}

const ProductSchema: Schema<IProduct> = new Schema({
   product_no: { type: String, required: true, unique: true }, // 상품 번호
   product_nm: { type: String, required: true }, // 상품 이름
   product_price: { type: String, required: true }, // 상품 가격
   product_desc: { type: String, required: true }, // 상품 상세 설명
   product_condition: { type: String, required: true }, // 상품 상태 (new, used, damaged)
   product_img: { type: String, required: true }, // 상품 이미지 URL
   product_reg_date: { type: Date, default: Date.now }, // 상품 등록일
   expiry_date: { type: Date }, // 등록 만료일
   view_cnt: { type: Number, default: 0 }, // 조회 수
   favorite_cnt: { type: Number, default: 0 }, // 좋아요 수
   seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 판매자 ID (참조)
   trade_loc: { type: String, required: true }, // 거래 희망 장소
   trade_stuats: { type: String, default: 'available' }, // 거래 상태 (기본값: available)
   trade_complete_date: { type: Date }, // 거래 완료 날짜
   trade_method: { type: String, required: true }, // 거래 방식
   buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // 구매자 ID (참조, 선택적)
});

export default mongoose.model<IProduct>('Product', ProductSchema);
