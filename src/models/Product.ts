import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Product extends Model {
   public id!: number; // 상품 ID (Primary Key)
   public product_no!: string; // 상품 번호
   public product_nm!: string; // 상품 이름
   public product_price!: number; // 상품 가격
   public product_category!: string; // 상품 가격
   public product_desc!: string; // 상품 상세 설명
   public product_condition!: string; // 상품 상태 (new, used, damaged)
   public product_img!: string; // 상품 이미지 URL
   public product_reg_date!: Date; // 상품 등록일
   public expiry_date?: Date; // 등록 만료일
   public view_cnt!: number; // 조회 수
   public favorite_cnt!: number; // 좋아요 수
   public seller_id!: number; // 판매자 ID (User 참조)
   public trade_loc!: string; // 거래 희망 장소
   public trade_status!: string; // 거래 상태 (available, reserved, completed)
   public trade_complete_date?: Date; // 거래 완료 날짜 (선택적)
   public trade_method!: string; // 거래 방식 (e.g., 직거래, 택배 거래)
   public buyer_id?: number; // 구매자 ID (User 참조, 선택적)
}

Product.init(
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      product_no: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true,
         defaultValue: DataTypes.UUIDV4,
      },
      product_nm: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      product_price: {
         type: DataTypes.FLOAT,
         allowNull: false,
      },
      product_category: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      product_desc: {
         type: DataTypes.TEXT,
         allowNull: false,
      },
      product_condition: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      product_img: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      product_reg_date: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
      },
      expiry_date: {
         type: DataTypes.DATE,
         allowNull: true,
      },
      view_cnt: {
         type: DataTypes.INTEGER,
         defaultValue: 0,
      },
      favorite_cnt: {
         type: DataTypes.INTEGER,
         defaultValue: 0,
      },
      seller_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: User,
            key: 'id',
         },
      },
      trade_loc: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      trade_status: {
         type: DataTypes.STRING,
         defaultValue: 'available',
      },
      trade_complete_date: {
         type: DataTypes.DATE,
         allowNull: true,
      },
      trade_method: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      buyer_id: {
         type: DataTypes.INTEGER,
         allowNull: true,
         references: {
            model: User,
            key: 'id',
         },
      },
   },
   {
      sequelize,
      tableName: 'products',
      timestamps: false,
   },
);

export default Product;
