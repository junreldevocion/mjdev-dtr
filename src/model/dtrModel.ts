import mongoose, { Schema, Document, } from 'mongoose';

export interface IDTR extends Document {
  timeInOutDate: Date;
  timeIn: Date;
  timeOut: Date;
  hoursWorked: string;
  overtime: Date;
}
const options = { timestamps: true };


const DTRSchema: Schema = new Schema<IDTR>({
  timeInOutDate: { type: Date, required: true },
  timeIn: { type: Date, required: true },
  timeOut: { type: Date, required: true },
  hoursWorked: { type: String, required: true },
  overtime: { type: Date, required: false }
}, options);

const DTR = mongoose.model('DTR') ?? mongoose.model('DTR', DTRSchema);

export default DTR;