import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { Floor } from '../../floor/entities/floor.entity';
import { Organization } from '../../organization/models/organization.model';
import { Property } from '../../property/models/property.model';
import { Building } from '../../building/models/building.model';
import { Coil } from 'src/modules/modbus/models/coil.model';
import { DiscreteInput } from 'src/modules/modbus/models/discrete-input.model';
import { HoldingRegister } from 'src/modules/modbus/models/holding-regster.model';
import { InputRegister } from 'src/modules/modbus/models/input-register.model';

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

  @Prop({type:Device,required:false})
  devices:Device
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
