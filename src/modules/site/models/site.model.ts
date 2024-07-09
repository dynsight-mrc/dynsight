import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';


interface SiteAttrs{
  name: string;
  location: string;
  coordiantes: GeolocationCoordinates;
  surface : number
}
export interface SiteModel extends Model<Site>{
  build(attrs:SiteAttrs):Site
}
@Schema()
class GeolocationCoordinates extends Document {
  @Prop({type:[Number],required:false})
  latitude: number;

  @Prop({type:[Number],required:false})
  longitude: number;
}

@Schema()
export class Site extends Document {
  @Prop()
  name: string;
  location: string;
  coordiantes: GeolocationCoordinates;
  surface : number
}


export const SiteSchema =SchemaFactory.createForClass(Site)
SiteSchema.set("toJSON",{
  transform :(doc,ret)=>{
    ret.id = doc._id;
    delete ret._id;
  }
})

SiteSchema.statics.build=function(attrs:SiteAttrs){
  return new this(attrs);
}