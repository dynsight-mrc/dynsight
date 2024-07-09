import { IsString, IsNumber, IsArray, IsObject, ValidateNested, IsEmail, IsOptional } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  reference: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  owner: string;
}
