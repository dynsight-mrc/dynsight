import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { ModbusIpServer } from "./modbus-ip-server.model";

interface CoilAttrs {
    name:string;
    startAddress : string;
    coilQuantity : string;
    modbusServer : string;
}

export interface CoilModel extends Model<Coil>{
    build (attrs:CoilAttrs):Coil
}

@Schema()
export class Coil extends Document{
    @Prop({type:String,required:true,unique:true})
    name:string
    
    @Prop({type: String,required:true})
    startAddress : string;

    @Prop({type: String,required:true})
    coilQuantity : string;

    @Prop({type: String,required:true,ref:ModbusIpServer.name})
    modbusServer : string;
}

export const CoilSchema = SchemaFactory.createForClass(Coil)

CoilSchema.set("toJSON",{
    transform:(doc,ret)=>{
        ret.id = doc._id
        delete ret._id
    }
})

CoilSchema.statics.build = function (attrs:CoilAttrs) {
        return new this(attrs)
}


