import { SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export class Floor extends Document{

}


export const FloorSchema = SchemaFactory.createForClass(Floor)