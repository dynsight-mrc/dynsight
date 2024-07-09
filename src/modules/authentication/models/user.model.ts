import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as UserDtos from '../dtos/user.dto'

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
  @Prop({ type: String, required: true })
  gender: UserDtos.Gender;
  @Prop({ type: String, required: true })
  deteOfBirth: string;
}

@Schema({ _id: false })
class ContactInformation extends Document {
  @Prop({ type: String, required: true })
  address: string;
  @Prop({ type: String, required: true })
  phone: string;
  @Prop({ type: String, required: true })
  email: string;
}

@Schema({ _id: false })
class Authentication extends Document {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;
}

@Schema({ _id: false })
class Permissions extends Document {
  @Prop({ type: String, required: true })
  role: UserDtos.UserRole;
}

@Schema({ _id: false })
class ProfileInformation extends Document {
  @Prop({ type: String, required: true })
  picture: string;
}
@Schema({ _id: false })
class Preferences extends Document {
  @Prop({ type: String, required: true })
  language: string;
  @Prop({ type: String, required: true })
  theme: string;
}

@Schema()
class User extends Document {
  personalInformation: PersonalInformation;
  contactInformation: ContactInformation;
  authentication: Authentication;
  permissions: Permissions;
  profileInformation: ProfileInformation;
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
