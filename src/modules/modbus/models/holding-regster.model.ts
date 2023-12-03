import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model ,Document} from 'mongoose';
import { ModbusServer } from '../services/modbus-ip-server/modbus-server';
import { DataType } from '../dtos/enums/data-types.enum';
interface HoldingRegisterAttrs {
  name:string;
  startAddress: number;
  inputQuantity: number;
  endianness: boolean;
  datatype: DataType | string;
}

export interface HoldingRegisterModel extends Model<HoldingRegister> {
  build(attrs: HoldingRegisterAttrs): HoldingRegister;
}

@Schema()
export class HoldingRegister extends Document {
  @Prop({type:String,required:true,unique:true})
  name:string
  @Prop({ type: Number, required: true })
  startAddress: number;
  @Prop({ type: Number, required: true })
  inputQuantity: number;
  @Prop({ type: Boolean, required: true })
  endianness: boolean;
  @Prop({ type: String, required: true })
  datatype: DataType | string;
  @Prop({ type: String, required: true, ref: ModbusServer.name })
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
