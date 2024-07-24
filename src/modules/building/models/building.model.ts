import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model, ObjectId, SchemaType, SchemaTypes, Types } from 'mongoose';
import { Organization } from '../../organization/models/organization.model';
import { AddressDto } from '../dtos/create-building.dto';

interface BuildingAttrs {
  reference: string;
  organizationId:Types.ObjectId
  name: string;
  constructionYear: number;
  surface: number;
  address: AddressDto;
  type: string;
}
export interface BuildingModel extends Model<Building> {
  build(buildingAttrs: BuildingAttrs): Building;
}

@Schema({ id: false })
class Coordinates extends Document {
  @Prop({ type: Number })
  lat: number;

  @Prop({ type: Number })
  long: number;
}

@Schema({ id: false })
class Address extends Document {
  @Prop({ type: String })
  streetAddress: string;
  @Prop({ type: String })
  streetNumber: string;
  @Prop({ type: String })
  streetName: string;
  @Prop({ type: String })
  city: string;
  @Prop({ type: String })
  state: string;
  @Prop({ type: Number })
  postalCode: number;
  @Prop({ type: String })
  country: string;
  @Prop({ type: Object })
  coordinates?: Coordinates;
}
@Schema()
export class Building extends Document {
  @Prop({ type: String })
  reference: string;

  @Prop({type:SchemaTypes.ObjectId,ref:Organization.name})
  organizationId:ObjectId

  @Prop({ type: String, })
  name: string;

  @Prop({ type: Number })
  constructionYear: number;

  @Prop({ type: Number })
  surface: number;

  @Prop({ type: Object })
  address: Address;

  @Prop({ type: String })
  type: string;
}

export const BuildingSchema = SchemaFactory.createForClass(Building);
BuildingSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
  },
});
BuildingSchema.index({organizationId:1,name:1},{unique:true})
BuildingSchema.statics.build = function (attrs: BuildingAttrs) {
  return new this(attrs);
};
