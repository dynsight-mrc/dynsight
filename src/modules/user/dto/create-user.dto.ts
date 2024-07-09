import { Type } from 'class-transformer';
import * as UserDtos from './user.dto';

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserRole } from './enums/user-role.enum';
import { UserGender } from './enums/user-gender.enum';



class PersonalInformationDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsEnum(UserGender)
  gender: UserGender;
  @IsString()
  dateOfBirth: string;
}
class ContactInformationDto {
  @IsString()
  address: string;
  @IsString()
  phone: string;
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
  @IsEnum(UserRole)
  role: UserRole;
  @IsString()
  organization:string
}
class ProfileInformationDto {
  @IsString()
  picture: string;
}
class PreferencesDto {
  @IsString()
  language: string;
  @IsString()
  theme: string;
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
  profileInformation: ProfileInformationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PreferencesDto)
  prefrences: PreferencesDto;
}
