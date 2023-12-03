import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model,Document } from 'mongoose';
import { DataType } from '../dtos/enums/data-types.enum';
import { ModbusIpServer } from './modbus-ip-server.model';
interface InputRegisterAttrs {
  name:string;
  startAddress: string;
  inputQuantity: string;
  endianness: boolean;
  dataType: DataType | string;
  modbusServer:string
}

export interface InputRegisterModel extends Model<InputRegister> {
  build(attrs: InputRegisterAttrs): InputRegister;
}

@Schema()
export class InputRegister extends Document {
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

export const InputRegisterSchema = SchemaFactory.createForClass(InputRegister);

InputRegisterSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
  },
});

InputRegisterSchema.statics.build = function (attrs: InputRegisterAttrs) {
  return new this(attrs);
};
