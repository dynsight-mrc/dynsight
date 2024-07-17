import { Type } from 'class-transformer';
import * as UserDtos from './user.dto';

import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { UserGender } from '@modules/user/dto/enums/user-gender.enum';
import { UserRole } from '@modules/user/dto/user.dto';



class PersonalInformationDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsEnum(UserGender)
  gender?: UserGender|string;
  @IsString()
  dateOfBirth?: string;
}
class ContactInformationDto {
  @IsString()
  address?: string;
  @IsString()
  phone?: string;
  @IsString()
  email: string;
}
class AuthenticationDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
}
class PermissionsDto {
  @IsString()
  role: UserRole;
  @IsMongoId()
  organizationId:Types.ObjectId
  @IsMongoId()
  floorId?:Types.ObjectId
  @IsMongoId()
  buildingId?:Types.ObjectId
}
class ProfileInformationDto {
  @IsString()
  picture?: string;
}
class PreferencesDto {
  @IsString()
  language?: string;
  @IsString()
  theme?: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PersonalInformationDto)
  personalInformation: PersonalInformationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactInformationDto)
  contactInformation: ContactInformationDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AuthenticationDto)
  authentication: AuthenticationDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PermissionsDto)
  permissions: PermissionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProfileInformationDto)
  profileInformation?: ProfileInformationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences?: PreferencesDto|undefined;
}
