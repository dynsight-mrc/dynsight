import { Type } from 'class-transformer';
import { IsString, IsNumber, ValidateNested, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { AddressDto } from './building-address.dto';

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
