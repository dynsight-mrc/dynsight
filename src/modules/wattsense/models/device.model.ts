import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { DeviceStatus } from 'src/common/wattsense/enums/device-status.enum';

interface DeviceAttrs {
  deviceId: string;
  name: string;
  orgranizationId: string;
  siteId: string;
  status : DeviceStatus | string
}

export interface DeviceModel extends Model<Device>{
    build(attrs:DeviceAttrs):Device
}

@Schema()
export class Device extends Document {
  @Prop({ type: String })
  deviceId: string;
  @Prop({ type: String })
  name: string;
  @Prop({ type: String })
  orgranizationId: string;
  @Prop({ type: String })
  siteId: string;
  @Prop({type:String})
  status:DeviceStatus | string
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

DeviceSchema.set("toJSON",{
    transform:(doc,ret)=>{
        ret.id = doc._id
        delete ret._id
    }
})

DeviceSchema.statics.build=function (attrs:DeviceAttrs) {
    return new this(attrs)
}
