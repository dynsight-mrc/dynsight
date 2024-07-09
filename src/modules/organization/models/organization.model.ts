import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

interface OrganizationAttrs {
  name: string;
  reference: string;
  description: string;
  owner: string;
}

export interface OrganizationModel extends Model<Organization> {
  build(attrs: OrganizationAttrs): Organization;
}

@Schema()
export class Organization extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  reference: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  owner: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

OrganizationSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
  },
});

OrganizationSchema.statics.build = function (attrs: OrganizationAttrs) {
  return new this(attrs);
};
