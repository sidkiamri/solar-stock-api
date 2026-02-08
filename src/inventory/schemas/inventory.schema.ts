import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Inventory extends Document {
  @Prop({ required: true })
  name: string; // e.g., "Panneau Solaire Jinko 450W"

  @Prop({ required: true, default: 0 })
  quantity: number;

  @Prop({ required: true })
  category: string; // e.g., "Panneaux", "Onduleurs"

  @Prop({ default: 10 })
  minThreshold: number; // For the alert system mentioned in your PDF

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId; // Links the item to the user who created it
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);