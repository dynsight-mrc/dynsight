import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { Building } from '../../building/models/building.model';
import { Organization } from '../../organization/models/organization.model';

interface FloorAttrs {
  floorNumber?: number;

  name: string;

  surface?: number;

  buildingId: Types.ObjectId;

  organizationId: Types.ObjectId;

  numberOfRooms?: number;

  occupancyStatus?: string;

  constructionYear?: number;

  floorPlan?: string;

  height?: number;

  fireExits?: number;

  elevatorAccess?: boolean;

  securityFeatures?: string[];

  facilities?: string[];

  occupants?: Types.ObjectId[];

  lastRenovated?: number;

  maintenanceLogs?: Types.ObjectId[];

  emergencyContact?: string;

  isAccessible?: boolean;

  notes?: string;
}

export interface FloorModel extends Model<Floor> {
  build(attrs: FloorAttrs): Floor;
}

@Schema()
export class Floor extends Document {
  @Prop({ type: Number, required: true })
  number: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number })
  surface?: number;

  @Prop({ type: Types.ObjectId, ref: Building.name, required: true })
  buildingId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Organization.name, required: true })
  organizationId: Types.ObjectId;

  @Prop()
  numberOfRooms?: number;

  @Prop({
    enum: ['Vacant', 'Occupied', 'Under Maintenance'],
  })
  occupancyStatus?: string;

  @Prop({ type: Number })
  constructionYear?: number;

  @Prop({ type: String })
  floorPlan?: string;

  @Prop({ type: Number })
  height?: number;

  @Prop({ type: Number })
  fireExits?: number;

  @Prop({ type: Boolean })
  elevatorAccess: boolean;

  @Prop({ type: [String], default: undefined })
  securityFeatures?: string[];

  @Prop({ type: [String], default: undefined })
  facilities?: string[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Occupant' }],

    default: undefined,
  })
  occupants?: Types.ObjectId[];

  @Prop({ type: Number })
  lastRenovated?: number;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'MaintenanceLog' }],
    default: undefined,
  })
  maintenanceLogs?: Types.ObjectId[];

  @Prop({ type: String })
  emergencyContact?: string;

  @Prop({ type: Boolean })
  isAccessible?: boolean;

  @Prop({ type: String })
  notes?: string;
}

export const FloorSchema = SchemaFactory.createForClass(Floor);
FloorSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
    delete ret.__v
  },
});
FloorSchema.index(
  { organizationId: 1, buildingId: 1, name: 1, number: 1 },
  { unique: true },
);

FloorSchema.statics.build = function (attrs: FloorAttrs) {
  return new this(attrs);
};
