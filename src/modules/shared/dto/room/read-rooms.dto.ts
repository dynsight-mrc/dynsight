import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class ReadRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  floorId: string;

  @IsString()
  @IsOptional()
  buildingId: string;

  @IsString()
  @IsOptional()
  organizationId: string;

  @IsNumber()
  @IsOptional()
  surface?: number;

  @IsArray()
  @IsString()
  @IsOptional()
  zone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  properties?: string[];
}

export class ReadRoomDocumentDto {
  @IsString()
  id: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  floorId: Types.ObjectId;

  @IsString()
  @IsOptional()
  buildingId: Types.ObjectId;

  @IsString()
  @IsOptional()
  organizationId: Types.ObjectId;

  @IsNumber()
  @IsOptional()
  surface?: number;

  @IsString()
  @IsOptional()
  zone?: string;
}

export type ReadRoomDocumentWithDetails = {
  id: Types.ObjectId;
  name: string;
  floor: { id: Types.ObjectId; name: string; number: number };
  building: { id: Types.ObjectId; name: string };
  organization: { id: Types.ObjectId; name: string };
  surface?: number;
  zone?:{id:Types.ObjectId,name:string}
};
