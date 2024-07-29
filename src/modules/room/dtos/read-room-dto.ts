import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { ReadPropertyDto } from 'src/modules/wattsense/dtos/properties/read-property.dto';

export class ReadRoomDto {
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

  @IsString()
  @IsOptional()
  zone: string;
}

export type ReadRoomWithFloorId = {
  id: Types.ObjectId;
  name: string;
  floorId?: Types.ObjectId;
  buildingId?: Types.ObjectId;
  organizationId?: Types.ObjectId;
  zone: string;
};
