import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model,Document } from 'mongoose';

interface ModbusIpServerAttrs {

  name:string;

  //serverId: number;

  ipAddress: string;

  port: number;
}

export interface ModbusIpServerModel extends Model<ModbusIpServer> {
  build(attrs:ModbusIpServerAttrs): ModbusIpServer;
}

@Schema()
export class ModbusIpServer extends Document {
  @Prop({type:String,required:true,unique:true})
  name:string

  /* @Prop({ type: Number, required: true })
  serverId: number; */

  @Prop({ type: String, required: true })
  ipAddress: string;

  @Prop({ type: Number, required: true })
  port: number;
}

export const ModbusIpServerSchema = SchemaFactory.createForClass(ModbusIpServer);

ModbusIpServerSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
  },
});

ModbusIpServerSchema.statics.build = function (
  attrs: ModbusIpServerAttrs,
) {
  return new this(attrs);
};
