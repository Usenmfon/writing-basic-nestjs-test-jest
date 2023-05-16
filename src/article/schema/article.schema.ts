import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Article extends Document {
  @Prop()
  title: string;

  @Prop()
  authorName: string;

  @Prop()
  body: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
