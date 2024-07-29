import { Type } from 'class-transformer';
import { IsString, ValidateNested, IsInt, IsMongoId, IsNumber } from 'class-validator';
import { Types } from 'mongoose';
import { AddressDto } from './building-address.dto';
import { ReadFloorWithDetailedRoomsList } from '@modules/floor/dtos/read-floor.dto';

export class ReadBuildingDto {
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
  organizationId:Types.ObjectId

}



export type ReadBuildingWithDetailedFloorsList = {
  reference: string;
  name: string;
  constructionYear: number;
  surface: number;
  address: AddressDto;
  type: string;
  id: Types.ObjectId;
  floors: ReadFloorWithDetailedRoomsList[];
};
