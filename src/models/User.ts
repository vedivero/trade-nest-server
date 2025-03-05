import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
   public id!: number;
   public user_id!: string;
   public social_id!: string;
   public social_provider!: string;
   public email!: string;
   public password!: string;
   public nickname!: string;
   public profile_image!: string;
   public reg_date!: Date;
   public addr?: string;
   public rating!: number;
   public verified!: boolean;
   public emailToken!: string;
   public location!: string;
}

User.init(
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      user_id: {
         type: DataTypes.STRING,
         unique: true,
         allowNull: false,
      },
      social_id: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      social_provider: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      email: {
         type: DataTypes.STRING,
         unique: true,
         allowNull: true,
      },
      password: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      nickname: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      profile_image: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      reg_date: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
      },
      addr: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      rating: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      verified: {
         type: DataTypes.BOOLEAN,
         defaultValue: false,
      },
      emailToken: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      location: {
         type: DataTypes.STRING,
      },
   },
   {
      sequelize,
      tableName: 'users',
      timestamps: false,
   },
);

export default User;
