import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ReadPropertyDto } from 'src/modules/wattsense/dtos/properties/read-property.dto';


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
