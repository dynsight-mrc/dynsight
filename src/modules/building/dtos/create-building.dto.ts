import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  IsObject,
  ValidateNested,
  IsEmail,
  IsOptional,
  IsMongoId,
  IsInt,
} from 'class-validator';
import { ObjectId, Types } from 'mongoose';

class CoordinatesDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  long: number;
}

class AddressDto{
  @IsString()
  streetAddress: string;
  @IsString()
  streetNumber: string;
  @IsString()
  streetName: string;
  @IsString()
  city: string;
  @IsString()
  state: string;
  @IsString()
  postalCode: number;
  @IsString()
  country: string;
  @ValidateNested()
  @Type(()=>CoordinatesDto)
  coordinates?: CoordinatesDto;
}

export class  CreateBuildingDto {
  @IsString()
  reference: string;

  @IsMongoId()
  organizationId:Types.ObjectId

  @IsString()
  name: string;

  @IsNumber()
  constructionYear: number;

  @IsNumber()
  surface: number;


  @IsString()
  type: string;
  @ValidateNested()
  

  @ValidateNested()
  @Type(()=>AddressDto)
  address:AddressDto
}
