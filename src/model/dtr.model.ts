import mongoose, { Schema, Document, } from 'mongoose';

export interface IDTR extends Document {
  timeInOutDate: Date;
  timeIn: Date;
  timeOut: Date;
  hoursWorked: string;
  overtime: string;
  undertime: string;
  doubleTime: string;
  userId: string
}
const options = { timestamps: true };

const DTRSchema: Schema = new Schema<IDTR>({
  timeInOutDate: { type: Date, required: true },
  timeIn: { type: Date, required: true },
  timeOut: { type: Date, required: true },
  hoursWorked: { type: String, required: true },
  overtime: { type: String, required: true },
  undertime: { type: String, required: true },
  doubleTime: { type: String, required: true },
  userId: { type: String, required: true },
}, options);

delete mongoose.models['DTR'];
const DTR = mongoose.model('DTR', DTRSchema)
export default DTR