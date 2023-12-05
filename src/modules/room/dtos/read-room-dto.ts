import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PropertyDto } from 'src/modules/property/dtos/property.dto';
import { ReadPropertyDto } from 'src/modules/property/dtos/read-property.dto';

export class ReadRoomDto {
  @IsString()
  id:string


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
  @ValidateNested({each:true})
  @Type(()=>ReadPropertyDto)
  properties: ReadPropertyDto[];
}
