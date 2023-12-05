import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { Floor } from '../../floor/entities/floor.entity';
import { Organization } from '../../organization/models/organization.model';
import { Property } from '../../property/models/property.model';
import { Building } from '../../building/models/building.model';

interface RoomAttrs {
  name: string;
  floor?: string;
  building?: string;
  organization?: string;
  zone?:string;
  properties?: string[];
}

export interface RoomModel extends Model<Room> {
  build(attrs: RoomAttrs): Room;
}

@Schema()
export class Room extends Document {
  @Prop()
  name: String;

  @Prop({ type: String, required: false, ref: Floor.name })
  floor: String;

  @Prop({ type: String, required: false, ref: Building.name })
  building: String;

  @Prop({ type: String, required: false, ref: Organization.name })
  organization: String;

  @Prop({ type: String, required: false})
  zone: string;

  @Prop({ type: [String],default:[], required: false, ref: Property.name })
  properties: string[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
  },
});

RoomSchema.statics.build = function (attrs: RoomAttrs) {
  return new this(attrs);
};
