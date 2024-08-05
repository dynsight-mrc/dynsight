import { Types } from 'mongoose';
import { AddressDto } from './building-address.dto';



import { UserRole } from '@modules/user/dto/user.dto';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
  ArrayMinSize,
  IsInt,
  IsMongoId,
} from 'class-validator';

export class CreateBuildingDto {
  @IsString()
  reference: string;

  @IsMongoId()
  organizationId: Types.ObjectId;

  @IsString()
  name: string;

  @IsNumber()
  constructionYear: number;

  @IsNumber()
  surface: number;

  @IsString()
  type: string;
  @ValidateNested()

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}


class CoordinatesDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  long: number;
}

export class BuildingDto {
  @IsString()
  reference: string;

  @IsString()
  name: string;

  @IsNumber()
  constructionYear: number;

  @IsNumber()
  surface: number;

  @IsString()
  type: string;
}

class FloorsDto {
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

class LocationDto {
  @IsString()
  streetAddress: string;
  @IsString()
  streetNumber: string;
  @IsString()
  streetName: string;
  @IsString()
  city: string;
  @IsString()
  state: string;
  @IsInt()
  postalCode: number;
  @IsString()
  country: string;
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;
}

class BlocsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  name: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  floors: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  surface?: number[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  type?: string[];
}




export class CreateBuildingWithRelatedEntities {
  
 
  @ValidateNested()
  @Type(() => BuildingDto)
  building: BuildingDto;

  @ValidateNested()
  @Type(() => FloorsDto)
  floors: FloorsDto;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ValidateNested()
  @Type(() => BlocsDto)
  blocs: BlocsDto;
}



