import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Device } from './device.model';
import { ProtocolList } from '../../../common/wattsense/enums/protocol-list.enum';


interface EquipmentAttrs {
  equipmentId: string;

  deviceId: string;

  name: string;

  protocol?: ProtocolList;
}

export interface EquipmentModel extends Model<Equipment> {
  build(attrs: EquipmentAttrs): Equipment;
}

@Schema({ collection: 'equipments' })
export class Equipment extends Document {
  @Prop({ type: String })
  equipmentId: string;

  @Prop({ type: String, ref: Device.name })
  deviceId: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String, enum: ProtocolList })
  protocol: string;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);

EquipmentSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
  },
});

EquipmentSchema.statics.build = function (attrs: EquipmentAttrs) {
  return new this(attrs);
};
