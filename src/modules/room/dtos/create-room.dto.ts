import { Type } from '@nestjs/common';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  floor?: string;

  @IsString()
  @IsOptional()
  building?: string;

  @IsString()
  @IsOptional()
  organization?: string;

  @IsArray()
  @IsString()
  @IsOptional()
  zone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  properties?: string[];
}

export class CreateRoomDtoV2 {
  @IsString()
  name: string;

  @IsMongoId()
  floorId: Types.ObjectId;

  @IsMongoId()
  buildingId: Types.ObjectId;

  @IsMongoId()
  organizationId: Types.ObjectId;

  @IsInt()
  @IsOptional()
  surface?: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsMongoId()
  zone?:Types.ObjectId

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  properties?: Types.ObjectId[];
}
