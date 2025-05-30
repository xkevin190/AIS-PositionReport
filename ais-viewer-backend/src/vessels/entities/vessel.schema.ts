import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vessel extends Document {
  @Prop({ unique: true, index: true })
  mmsi: number;

  @Prop()
  name: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Prop({ index: true })
  updatedAt: Date;
}

export const VesselSchema = SchemaFactory.createForClass(Vessel);

VesselSchema.index({ updatedAt: 1, location: '2dsphere' });
