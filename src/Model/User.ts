import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
   user_id: string;
   social_id: string;
   social_provider: string;
   email?: string;
   nickname: string;
   profile_image: string;
   reg_date: Date;
   addr?: string;
   rating?: number;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema: Schema<IUserDocument> = new Schema<IUser>({
   user_id: { type: String, required: true, unique: true },
   social_id: { type: String, required: true },
   social_provider: { type: String, required: true },
   email: { type: String },
   nickname: { type: String, required: true },
   profile_image: { type: String },
   reg_date: { type: Date, defualt: Date.now },
   addr: { type: String },
   rating: { type: Number, default: 0 },
});

export default mongoose.model<IUser>('User', UserSchema);
