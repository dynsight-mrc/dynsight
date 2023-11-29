import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ReadRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  floor: string;

  @IsString()
  @IsOptional()
  building: string;

  @IsString()
  @IsOptional()
  organization: string;

  @IsString()
  @IsOptional()
  zone:string
  
  @IsArray()
  @IsString()
  @ValidateNested({ each: true })
  properties: string[];
}
