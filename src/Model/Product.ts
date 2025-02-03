import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
   product_no: string; //상품번호
   product_nm: string; //상품이름
   product_price: string; //상품가격
   product_desc: string; //상품상세설명
   product_condition: string; //상품상태(new, used, damaged)
   product_img: string; //상품이미지
   product_reg_date: Date; //상품등록일
   expiry_date: Date; //등록만료일
   view_cnt: number; //조회 수
   favorite_cnt: number; //좋아요 수
   seller_nm: string; //판매자이름
   seller_phone: string; //판매자연락처
   seller_addr: string; //판매자주소
   seller_loc: string; //판매자위치좌표
   seller_rating: string; //판매자평점
   trade_loc: string; //거래희망장소
   trade_stuats: string; //거래상태(available, reserved, completed)
   trade_complete_date: Date; //거래완료날짜
   trade_method: string; //거래방식
   buyer_info: string; //구매자정보
}

const ProductSchema: Schema<IProduct> = new Schema({
   product_no: { type: String },
   product_nm: { type: String },
   product_price: { type: String },
   product_desc: { type: String },
   product_condition: { type: String },
   product_img: { type: String },
   product_reg_date: { type: Date },
   expiry_date: { type: Date },
   view_cnt: { type: Number },
   favorite_cnt: { type: Number },
   seller_nm: { type: String },
   seller_phone: { type: String },
   seller_addr: { type: String },
   seller_loc: { type: String },
   seller_rating: { type: String },
   trade_loc: { type: String },
   trade_stuats: { type: String },
   trade_complete_date: { type: Date },
   trade_method: { type: String },
   buyer_info: { type: String },
});

export default mongoose.model<IProduct>('Product', ProductSchema);
