import { Type } from 'class-transformer';
import { IsString, ValidateNested, IsInt, IsMongoId, IsNumber } from 'class-validator';
import { Types } from 'mongoose';
import { AddressDto } from './building-address.dto';
import { ReadFloorDto, ReadFloorWithDetailedRoomsList } from '@modules/floor/dtos/read-floor.dto';
import { ReadRoomDto } from '@modules/room/dtos/read-room-dto';
import { ReadUserDto } from '@modules/user/dto/read-user.dto';

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
  organizationId:String

}

export type ReadBuildingWithDetailedFloorsList = {
  reference: string;
  name: string;
  constructionYear: number;
  surface: number;
  address: AddressDto;
  type: string;
  id: Types.ObjectId;
  organization:{name:string,owner:string,id:Types.ObjectId};
  floors: ReadFloorWithDetailedRoomsList[];
};
export type ReadBuildingWithOrganizationDetails = {
  id:Types.ObjectId
  reference: string;
  name: string;
  constructionYear: number;
  surface: number;
  address: AddressDto;
  type: string;
  organization:{name:string,owner:string,id:Types.ObjectId};

};


export type ReadBuildingOverview = {
  id:Types.ObjectId
  reference: string;
  name: string;
  constructionYear: number;
  surface: number;
  address: AddressDto;
  type: string;
  numberOfFloors: number;
  numberOfRooms:number;
  organization:{name:string,owner:string,id:Types.ObjectId};

};


export type ReadCreatedBuildingDto = {
  organization: Types.ObjectId;
  building: ReadBuildingDto;
  floors: ReadFloorDto[];
  blocs: ReadRoomDto[];
};