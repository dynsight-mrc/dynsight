import {
  IsString,
  IsNumber,
  IsArray,
  IsObject,
  ValidateNested,
  IsEmail,
  IsOptional,
} from 'class-validator';

class FloorsDto {
  @IsArray()
  @IsString({ each: true })
  reference: string[];

  @IsArray()
  @IsString({ each: true })
  name: string[];
}
