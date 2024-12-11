import { Type } from 'class-transformer';
import { IsString, IsNumber, ValidateNested, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CoordinatesDto {
  @IsString()
  lat: number;

  @IsString()
  long: number;
}


export class AddressDto {
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
    @IsString()
    postalCode: number;
    @IsString()
    country: string;
    @ValidateNested()
    @Type(() => CoordinatesDto)
    coordinates?: CoordinatesDto;
  }
  