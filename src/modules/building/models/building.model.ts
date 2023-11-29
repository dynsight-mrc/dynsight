import { SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export class Building extends Document{
    
}


export const BuildingSchema = SchemaFactory.createForClass(Building)