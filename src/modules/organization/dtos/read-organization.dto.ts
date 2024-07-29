import { ReadBuildingWithDetailedFloorsList } from '@modules/building/dtos/read-building.dto';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ReadOrganizationDto {
  @IsString()
  id: Types.ObjectId;

  @IsString()
  reference: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  owner: string;
}

export class ReadOrganizationWithDetailedBuildingsList {
  @IsString()
  id: Types.ObjectId;

  @IsString()
  reference: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  owner: string;

  buildings: ReadBuildingWithDetailedFloorsList[];
}

export type ReadOrganizationOverviewDto = {
  name: string;
  reference: string;
  description: string;
  owner: string;
  id: string;
  type: string;
  numberOfBuildings: number;
  totalSurface: number;
  image?: string;
};
