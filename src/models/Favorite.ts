import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Product from './Product';
import User from './User';

class Favorite extends Model {
   public id!: number; // 찜 ID
   public user_id!: number; // 찜한 사용자 ID
   public product_id!: number; // 찜한 상품 ID
}

Favorite.init(
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      user_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: User,
            key: 'id',
         },
         onDelete: 'CASCADE',
      },
      product_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: Product,
            key: 'id',
         },
         onDelete: 'CASCADE',
      },
   },
   {
      sequelize,
      tableName: 'favorites',
      timestamps: false,
   },
);

export default Favorite;
