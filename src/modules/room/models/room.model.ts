import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { Floor } from '../../floor/entities/floor.entity';
import { Organization } from '../../organization/models/organization.model';
import { Property } from '../../wattsense/models/property.model';
import { Building } from '../../building/models/building.model';
import { Coil } from '../../modbus/models/coil.model';
import { DiscreteInput } from '../../modbus/models/discrete-input.model';
import { HoldingRegister } from '../../modbus/models/holding-regster.model';
import { InputRegister } from '../../modbus/models/input-register.model';

interface RoomAttrs {
  name: string;
  floorId: Types.ObjectId;
  buildingId: Types.ObjectId;
  organizationId: Types.ObjectId;
  zone?:string;
  surface?:number;
  type?:string;
  properties?: string[];
}

export interface RoomModel extends Model<Room> {
  build(attrs: RoomAttrs): Room;
}

@Schema({_id:false})
class Device extends Document{
  @Prop({type:[String],required:false,ref:Property.name})
  properties : string[]

  @Prop({type:[String],required:false,ref:Coil.name})
  coils:string[]

  @Prop({type:[String],required:false,ref:DiscreteInput.name})
  discreteInputs :string[]

  @Prop({type:[String],required:false,ref:HoldingRegister.name})
  holdingRegisters : string[]

  @Prop({type:[String],required:false,ref:InputRegister.name})
  inputRegisters:string[]
}

@Schema()
export class Room extends Document {
  @Prop({type:String})
  name: string;

  @Prop({ type: Types.ObjectId,required:true,ref: Floor.name })
  floorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required:true, ref: Building.name })
  buildingId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: Organization.name })
  organizationId: Types.ObjectId;

  @Prop({ type: String, required: false})
  zone?: string;

  @Prop({ type: [String],default:undefined, required: false, ref: Property.name })
  properties?: string[];

  @Prop({type:Number,required:false})
  surface?:number
  @Prop({type:String,required:false})
  type?:string

  @Prop({type:Device,required:false})
  devices?:Device
}

export const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
    delete ret.__v
  },
});
RoomSchema.index({buildingId:1,name:1},{unique:true})

RoomSchema.statics.build = function (attrs: RoomAttrs) {
  return new this(attrs);
};
