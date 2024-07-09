import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import * as UserDtos from '../dto/user.dto'
import { Organization } from '../../organization/models/organization.model';
import { Building } from '../../building/models/building.model';
import { Floor } from '../../floor/models/floor.model';

type UserAttrs = {
  personalInformation: UserDtos.PersonalInformationDto;
  contactInformation: UserDtos.ContactInformationDto;
  authentication: UserDtos.AuthenticationDto;
  permissions: UserDtos.PermissionsDto;
  profileInformation: UserDtos.ProfileInformationDto;
  prefrences: UserDtos.PreferencesDto;
};

export interface UserModel extends Model<User> {
  build(attrs: UserAttrs): User;
}

@Schema({ _id: false })
class PersonalInformation extends Document {
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ type: String})
  gender?: UserDtos.Gender;
  @Prop({ type: String })
  deteOfBirth?: string;
}

@Schema({ _id: false })
class ContactInformation extends Document {
  @Prop({ type: String})
  address?: string;
  @Prop({ type: String })
  phone?: string;
  @Prop({ type: String, required: true })
  email: string;
}

@Schema({ _id: false })
class Authentication extends Document {
  @Prop({ type: String, required: true,unique:true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;
}

@Schema({ _id: false })
class Permissions extends Document {
  @Prop({ type: String, required: true })
  role: UserDtos.UserRole;
  
  @Prop({type:Types.ObjectId,ref:Organization.name,required:true})
  organizationId:Types.ObjectId

  @Prop({type:Types.ObjectId,ref:Building.name,required:true})
  buildingId:Types.ObjectId

  @Prop({type:Types.ObjectId,ref:Floor.name})
  floorId?:Types.ObjectId
}

@Schema({ _id: false })
class ProfileInformation extends Document {
  @Prop({ type: String})
  picture?: string;
}
@Schema({ _id: false })
class Preferences extends Document {
  @Prop({ type: String})
  language?: string;
  @Prop({ type: String })
  theme?: string;
}

@Schema()
export class User extends Document {
  @Prop({type:PersonalInformation,default:undefined})
  personalInformation: PersonalInformation;

  @Prop({type:ContactInformation,default:undefined})
  contactInformation: ContactInformation;

  @Prop({type:Authentication,default:undefined})
  authentication: Authentication;

  @Prop({type:Permissions,default:undefined})
  permissions: Permissions;

  @Prop({type:ProfileInformation,default:undefined})
  profileInformation: ProfileInformation;

  @Prop({type:Preferences,default:undefined})
  preferences: Preferences;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    (ret.id = doc._id), delete ret._id;
  },
});

UserSchema.statics.build = function (attrs: UserAttrs) {
  return new this(attrs);
};
