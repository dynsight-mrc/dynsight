import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import * as UserDtos from '../dto/user.dto';
import { Organization } from '../../organization/models/organization.model';
import { Building } from '../../building/models/building.model';
import { Floor } from '../../floor/models/floor.model';

interface AdminAttrs {
  details: UserDtos.PersonalInformationDto;
}

@Schema({ _id: false })
class Details extends Document {
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ enum: UserDtos.Gender })
  gender?: UserDtos.Gender;
  @Prop({ type: String })
  deteOfBirth?: string;
}
export interface AdminModel extends Model<Admin> {
  build(attrs: AdminAttrs): Admin;
}

@Schema({ _id: false })
class PersonalInformation extends Document {
  @Prop({ type: String, required: true,unique:true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ enum: UserDtos.Gender })
  gender?: UserDtos.Gender;
  @Prop({ type: String })
  deteOfBirth?: string;
}

@Schema({ _id: false })
class ContactInformation extends Document {
  @Prop({ type: String })
  address?: string;
  @Prop({ type: String })
  phone?: string;
  @Prop({ type: String, required: true })
  email: string;
}

@Schema({ _id: false })
class Authentication extends Document {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;
}

@Schema({ _id: false })
class Permissions extends Document {
  @Prop({ type: String, required: true })
  role: UserDtos.UserRole;

  @Prop({ type: Types.ObjectId, ref: Organization.name, required: true })
  organizationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Building.name })
  buildingId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Floor.name })
  floorId?: Types.ObjectId;
}

@Schema({ _id: false })
class ProfileInformation extends Document {
  @Prop({ type: String })
  picture?: string;
}
@Schema({ _id: false })
class Preferences extends Document {
  @Prop({ type: String })
  language?: string;
  @Prop({ type: String })
  theme?: string;
}
@Schema()
export class Admin extends Document {
  @Prop({ type: PersonalInformation })
  personalInformation: PersonalInformation;
  @Prop({ type: ContactInformation,  })
  contactInformation: ContactInformation;
  @Prop({ type: Authentication, })
  authentication: Authentication;
  @Prop({ type: Permissions, })

  permissions: Permissions;
  @Prop({ type: ProfileInformation, default: undefined })
  profileInformation?: ProfileInformation;

  @Prop({ type: Preferences, default: undefined })
  preferences?: Preferences;
}
export const AdminSchema = SchemaFactory.createForClass(Admin);


AdminSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
  },
});

AdminSchema.statics.build = function (attrs: AdminAttrs) {
  return new this(attrs);
};

