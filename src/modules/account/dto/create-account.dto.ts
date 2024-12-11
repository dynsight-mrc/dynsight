import { AddressDto } from '@modules/shared/dto/address/read-address.dto';
import {
  CreateBuildingAttrsWithoutLocationDto,
  CreateBuildingDocumentAttrsDto,
} from '@modules/shared/dto/building/create-building.dto';
import { CreateFloorsNamesAndNumbersAttrsDto } from '@modules/shared/dto/floor/create-floor.dto';
import { CreateOrganizationDocumentAttrsDto } from '@modules/shared/dto/organization/create-organization.dto';
import { CreateRoomsAttrsDto } from '@modules/shared/dto/room/create-rooms.dto';
import { CreateUsersAttrsDto } from '@modules/shared/dto/user/create-user.dto';
import { UserRole } from '@modules/shared/types/user.type';
import { Type } from 'class-transformer';
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsInt, IsNumber, IsString, ValidateNested } from 'class-validator';

/* export class CreateAccounAttrstDto {
  @ValidateNested()
  @Type(() => CreateBuildingAttrsWithoutLocationDto)
  building: CreateBuildingAttrsWithoutLocationDto;

  @ValidateNested()
  @Type(() => CreateFloorsNamesAndNumbersAttrsDto)
  floors: CreateFloorsNamesAndNumbersAttrsDto;

  @ValidateNested()
  @Type(() => AddressDto)
  location: AddressDto;

  @ValidateNested()
  @Type(() => CreateRoomsAttrsDto)
  blocs: CreateRoomsAttrsDto;

  @ValidateNested()
  @Type(() => CreateOrganizationDocumentAttrsDto)
  organization: CreateOrganizationDocumentAttrsDto;

  @ValidateNested()
  @Type(() => CreateUsersAttrsDto)
  users: CreateUsersAttrsDto;
} */

class CoordinatesDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  long: number;
}

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

class CreateAccountFloorsAttrsDto {
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
}

class LocationDto {
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
  @IsInt()
  postalCode: number;
  @IsString()
  country: string;
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;
}

class CreateAccountRoomsAttrsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  name: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  floors: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  surface: number[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  type: string[];
}

class CreateAccountOrganizationAttrsDto {
  @IsString()
  reference: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  owner: string;
}

class CreateAccountUsersAttrsADto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  firstName: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  lastName: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  email: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  password: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  role: (UserRole|string)[];
}

export class CreateAccountAttrsDto {
  @ValidateNested()
  @Type(() => CreateAccountBuildingAttrsDto)
  building: CreateAccountBuildingAttrsDto;

  @ValidateNested()
  @Type(() => CreateAccountFloorsAttrsDto)
  floors: CreateAccountFloorsAttrsDto;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ValidateNested()
  @Type(() => CreateAccountRoomsAttrsDto)
  blocs: CreateAccountRoomsAttrsDto;

  @ValidateNested()
  @Type(() => CreateAccountOrganizationAttrsDto)
  organization: CreateAccountOrganizationAttrsDto;

  @ValidateNested()
  @Type(() => CreateAccountUsersAttrsADto)
  users: CreateAccountUsersAttrsADto;
}
