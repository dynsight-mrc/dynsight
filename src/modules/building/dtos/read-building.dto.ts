import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  IsObject,
  ValidateNested,
  IsEmail,
  IsOptional,
  IsIn,
  IsInt,
} from 'class-validator';

class CoordinatesDto {
  @IsString()
  lat: string;

  @IsString()
  long: string;
}

export class ReadBuildingDto {
  @IsString()
  id: string;

  @IsString()
  reference: string;

  @IsString()
  name: string;

  @IsString()
  constructionYear: string;

  @IsInt()
  surface: number;

  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;

  @IsString()
  type: string;
}
