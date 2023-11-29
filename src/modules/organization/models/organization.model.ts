import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export class Organization extends Document{
    @Prop({type:String})
    name:string
}


export const OrganizationSchema = SchemaFactory.createForClass(Organization)