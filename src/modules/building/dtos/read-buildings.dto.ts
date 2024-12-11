import { Type } from 'class-transformer';
import { IsString, ValidateNested, IsInt, IsMongoId, IsNumber } from 'class-validator';
import { Types } from 'mongoose';
import { AddressDto } from './building-address.dto';


export class ReadBuildingDto {
  @IsString()
  id: Types.ObjectId;

  @IsString()
  reference: string;

  @IsString()
  name: string;

  @IsNumber()
  constructionYear: number;

  @IsInt()
  surface: number;

  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsMongoId()
  organizationId:String

}

export class ReadBuildingDocumentDto {
  @IsString()
  id: Types.ObjectId;

  @IsString()
  reference: string;

  @IsString()
  name: string;

  @IsNumber()
  constructionYear: number;

  @IsInt()
  surface: number;

  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsMongoId()
  organizationId:Types.ObjectId

}



