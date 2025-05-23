import mongoose, { Schema, Document, } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image?: string;
}
const options = { timestamps: true };

const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String, required: false },
}, options);

delete mongoose.models['USER'];
const USER = mongoose.model('USER', UserSchema)
export default USER