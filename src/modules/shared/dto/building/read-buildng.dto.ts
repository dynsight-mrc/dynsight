import { Type } from 'class-transformer';
import {
  IsString,
  ValidateNested,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';
import { AddressDto } from '../address/read-address.dto';
import { ReadOrganizationDocumentDto } from '../organization/read-organization.dto';
import { ReadFloorDocumentWithRoomsDetailsDto } from '../floor/read-floor.dto';

export class ReadBuildingDocumentDto {
  @IsString()
  id: Types.ObjectId;

  @IsString()
  reference: string;

  @IsString()
  name: string;

  
  @IsNumber()
  constructionYear: number;

  @IsInt()
  surface: number;

  
  @IsString()
  type: string;

  
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  
  @IsMongoId()
  organizationId: Types.ObjectId;
}

export class ReadBuildingDocumentwithDetailsDto {
  @IsString()
  id: Types.ObjectId;

  @IsString()
  reference: string;

  @IsString()
  name: string;

  @IsNumber()
  constructionYear: number;

  @IsInt()
  surface: number;

  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ValidateNested()
  @Type(() => ReadOrganizationDocumentDto)
  organization: ReadOrganizationDocumentDto;
}


export type ReadBuildingDocumentWithFloorsDetailsDto = {
  reference: string;
  name: string;
  constructionYear: number;
  surface: number;
  address: AddressDto;
  type: string;
  id: Types.ObjectId;
  organization:{name:string,owner:string,id:Types.ObjectId,description?:string,reference?:string};
  floors: ReadFloorDocumentWithRoomsDetailsDto[];
};


