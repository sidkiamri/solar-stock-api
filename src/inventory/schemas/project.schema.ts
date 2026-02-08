import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  projectName: string; // e.g., "Installation Ferme Solaire Kairouan"

  @Prop({ required: true })
  clientName: string;

  @Prop({ default: 'En Cours' }) // Planned, In Progress, Finished
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;
}
export const ProjectSchema = SchemaFactory.createForClass(Project);