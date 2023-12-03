import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model,Document } from "mongoose";
import { ModbusIpServer } from "./modbus-ip-server.model";

interface DiscreteInputAttrs {
    name:string;
    startAddress : string;
    inputQuantity : string;
    modbusServer : string;
}

export interface DiscreteInputModel extends Model<DiscreteInput>{
    build (attrs:DiscreteInputAttrs):DiscreteInput
}

@Schema()
export class DiscreteInput extends Document{
    @Prop({type:String,required:true,unique:true})
    name:string
    @Prop({type: String,required:true})
    startAddress : string;

    @Prop({type: String,required:true})
    inputQuantity : string;

    @Prop({type: String,required:true,ref:ModbusIpServer.name})
    modbusServer : string;
}

export const DiscreteInputSchema = SchemaFactory.createForClass(DiscreteInput)

DiscreteInputSchema.set("toJSON",{
    transform:(doc,ret)=>{
        ret.id = doc._id
        delete ret._id
    }
})

DiscreteInputSchema.statics.build = function (attrs:DiscreteInputAttrs) {
        return new this(attrs)
}


