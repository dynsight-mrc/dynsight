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

export class CreateFloorDto {

  @IsString()
  name: string;

  @IsInt()
  number: number;

  @IsMongoId()
  organizationId:Types.ObjectId

  @IsMongoId()
  buildingId:Types.ObjectId
}
