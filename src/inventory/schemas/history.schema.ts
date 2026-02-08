import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class StockHistory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Inventory' })
  itemId: Types.ObjectId;

  @Prop()
  itemName: string;

  @Prop()
  action: string; // "AJOUT", "RETRAIT", "AFFECTATION_PROJET"

  @Prop()
  quantityChanged: number;

  @Prop()
  relatedProject: string; // Name of the project if applicable

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}
export const StockHistorySchema = SchemaFactory.createForClass(StockHistory);