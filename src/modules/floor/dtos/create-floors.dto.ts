import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsMongoId,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateFloorsDto {
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

  @IsMongoId()
  organizationId: Types.ObjectId;

  @IsMongoId()
  buildingId: Types.ObjectId;
}

export class CreateFloorDto {
  @IsMongoId()
  id: Types.ObjectId;

  @IsString()
  name: string;

  @IsString()
  number: number;

  @IsMongoId()
  organizationId: Types.ObjectId;

  @IsMongoId()
  buildingId: Types.ObjectId;
}

class FloorsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  number: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  name: string[];
}

class BlocsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  name: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  type: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  surface: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  floors: string[];
}

export class CreateFloorsWithRoomsDto {
  @ValidateNested()
  @Type(() => FloorsDto)
  floors: FloorsDto;

  @ValidateNested()
  @Type(() => BlocsDto)
  blocs: BlocsDto;
}
