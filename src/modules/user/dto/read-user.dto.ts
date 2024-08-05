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



class PersonalInformationDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsOptional()
  @IsEnum(UserDtos.Gender)
  gender?: UserDtos.Gender;
  @IsOptional()
  @IsString()
  dateOfBirth?: string;
}
class ContactInformationDto {
  @IsString()
  @IsOptional()
  address?: string;
  @IsString()
  @IsOptional()
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
  role: UserDtos.UserRole;
  @IsOptional()
  @IsMongoId()
  organizationId?:Types.ObjectId
  @IsOptional()
  @IsMongoId()
  floorId?:Types.ObjectId
  @IsOptional()
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

export class ReadUserDto {
  @IsMongoId()
  id:Types.ObjectId
  
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



export type ReadUserOverview = {
  id:Types.ObjectId;
firstName: string;
lastName: string;
email: string;
organization: string;
role: string;
};


export type ReadUserByOrganizationId = {
  id:Types.ObjectId;
firstName: string;
lastName: string;
email: string;
role: string;
};