import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class PopularKeyword extends Model {
   public id!: number;
   public keyword!: string;
   public search_count!: number;
   public last_searched!: Date;
}

PopularKeyword.init(
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      keyword: {
         type: DataTypes.STRING(255),
         allowNull: false,
         unique: true,
      },
      search_count: {
         type: DataTypes.INTEGER,
         defaultValue: 1,
      },
      last_searched: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
      },
   },
   {
      sequelize,
      tableName: 'popular_keywords',
      timestamps: false,
   },
);

export default PopularKeyword;
