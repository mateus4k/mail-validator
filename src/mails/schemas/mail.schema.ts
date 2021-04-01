import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MailDocument = Mail & Document;

@Schema({ versionKey: false })
export class Mail {
  @Prop({ required: true, unique: true })
  mail: string;
}

export const MailSchema = SchemaFactory.createForClass(Mail);
