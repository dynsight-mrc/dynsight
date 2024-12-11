import {
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
    ArrayMinSize,
    ArrayNotEmpty,
    IsArray,
  } from 'class-validator';
  
  import { Type } from 'class-transformer';
  import * as UserTypes from '../../types/user.type';
  import { Types } from 'mongoose';


export class CreateUsersAttrsDto {
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    firstName: string[];
  
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    lastName: string[];
  
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    email: string[];
  
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    password: string[];
  
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    role: (UserTypes.UserRole|string)[];
  }



class PersonalInformationDto {
    @IsString()
    firstName: string;
    @IsString()
    lastName: string;
    @IsOptional()
    @IsEnum(UserTypes.Gender)
    gender?: UserTypes.Gender;
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
    role: UserTypes.UserRole|string;
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
  
  export class CreateUserDocumentAttrsDto {
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
  