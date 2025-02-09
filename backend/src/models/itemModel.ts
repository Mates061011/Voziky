// models/itemModel.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
  name: string;
  desc: string;
  pricePerDay: number;
  pricePerDays: number;
  type: 'prislusenstvi' | 'kocarek';
  img: string;
  kauce: string,
}

const itemSchema = new Schema<IItem>({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  pricePerDays: { type: Number, required: true },
  type: { type: String, enum: ['prislusenstvi', 'kocarek'], required: true },
  img: { type: String, required: true },
  kauce: { type: String, required: true },
});

const Item = mongoose.model<IItem>('Item', itemSchema);

export default Item;
