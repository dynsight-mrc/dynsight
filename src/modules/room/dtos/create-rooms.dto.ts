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

export class CreateRoomDocumentAttrsDto {
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
