import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model ,Document} from 'mongoose';
import { DataType } from '../dtos/enums/data-types.enum';
import { ModbusIpServer } from './modbus-ip-server.model';
interface HoldingRegisterAttrs {
  name:string;
  startAddress: string;
  inputQuantity: string;
  endianness: boolean;
  dataType: DataType | string;
  modbusServer:string
}

export interface HoldingRegisterModel extends Model<HoldingRegister> {
  build(attrs: HoldingRegisterAttrs): HoldingRegister;
}

@Schema()
export class HoldingRegister extends Document {
  @Prop({type:String,required:true,unique:true})
  name:string
  @Prop({ type: String, required: true })
  startAddress: string;
  @Prop({ type: String, required: true })
  inputQuantity: string;
  @Prop({ type: Boolean, required: true })
  endianness: boolean;
  @Prop({ type: String, required: true })
  dataType: DataType | string;
  @Prop({ type: String, required: true, ref: ModbusIpServer.name })
  modbusServer: string;
}

export const HoldingRegisterSchema =
  SchemaFactory.createForClass(HoldingRegister);

HoldingRegisterSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
  },
});

HoldingRegisterSchema.statics.build = function (attrs: HoldingRegisterAttrs) {
  return new this(attrs);
};
