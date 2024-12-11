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
import { AddressDto } from '../address/read-address.dto';


export class CreateAccountBuildingAttrsDto {
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

export class CreateBuildingAttrsWithoutLocationDto {
    @IsString()
    reference: string;
  
    @IsString()
    organizationId: string;
  
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
  

export class CreateBuildingDocumentAttrsDto {
    @IsString()
    reference: string;
  
    @IsString()
    organizationId: string;
  
    @IsString()
    name: string;
  
    @IsNumber()
    constructionYear: number;
  
    @IsNumber()
    surface: number;
  
    @IsString()
    type: string;
  
    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto;
  }
  