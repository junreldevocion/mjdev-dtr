import mongoose, { Schema, Document, } from 'mongoose';

export interface IDTR extends Document {
  timeInOutDate: Date;
  timeIn: Date;
  timeOut: Date;
  hoursWorked: string;
  overtime: string;
  undertime: string;
}
const options = { timestamps: true };

const DTRSchema: Schema = new Schema<IDTR>({
  timeInOutDate: { type: Date, required: true },
  timeIn: { type: Date, required: true },
  timeOut: { type: Date, required: true },
  hoursWorked: { type: String, required: true },
  overtime: { type: String, required: true },
  undertime: { type: String, required: true },
}, options);

const DTR =  mongoose.model<IDTR>('DTR', DTRSchema);

export default DTR;