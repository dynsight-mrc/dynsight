import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model,Document } from 'mongoose';
import { ModbusServer } from '../services/modbus-ip-server/modbus-server';
import { DataType } from '../dtos/enums/data-types.enum';
interface InputRegisterAttrs {
  name:string;
  startAddress: number;
  inputQuantity: number;
  endianness: boolean;
  datatype: DataType | string;
}

export interface InputRegisterModel extends Model<InputRegister> {
  build(attrs: InputRegisterAttrs): InputRegister;
}

@Schema()
export class InputRegister extends Document {
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
