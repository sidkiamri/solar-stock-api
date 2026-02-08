import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema()
export class User extends Document {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  companyName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Updated Hook: Removed 'next' because it's an async function
UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  // In modern Mongoose, returning from an async 'pre' hook 
  // acts the same as calling next()
});