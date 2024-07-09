
import { IsString, IsNumber, IsArray, IsObject, ValidateNested, IsEmail, IsOptional, ArrayNotEmpty, ArrayMinSize, IsInt, IsMongoId } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';



class CoordinatesDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  long: number;
}



export class  BuildingDto {
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

class FloorsDto {
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
  @Type(()=>CoordinatesDto)
  coordinates:CoordinatesDto
}

class BlocsDto {
 
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  name:string[]

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  floors: string[]

  
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNumber({},{each:true})
  surface? : number[]

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  type? : string[]
}

class OrganizationDto {
  @IsString()
  reference: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  owner: string;
}

class UserDto {
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
  role: string[];
}


export class CreateAccountDto {
  @ValidateNested()
  @Type(() => BuildingDto)
  building: BuildingDto;

  @ValidateNested()
  @Type(() => FloorsDto)
  floors: FloorsDto;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ValidateNested()
  @Type(() => BlocsDto)
  blocs: BlocsDto;

  @ValidateNested()
  @Type(() => OrganizationDto)
  organization: OrganizationDto;

  @ValidateNested()
  @Type(() => UserDto)
  users: UserDto;
}
