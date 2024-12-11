import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsMongoId,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateFloorsAttrsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  name: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  number: number[];

  @IsString()
  organizationId: string;

  @IsString()
  buildingId: string;
}
export class CreateFloorsNamesAndNumbersAttrsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  name: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  number: number[];
}

export class CreateFloorDocumentAttrsDto {

    @IsString()
    name: string;
  
    @IsInt()
    number: number;
  
    @IsMongoId()
    organizationId:Types.ObjectId
  
    @IsMongoId()
    buildingId:Types.ObjectId
  }

