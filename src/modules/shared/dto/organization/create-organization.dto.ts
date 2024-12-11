
import { IsString, IsNumber, IsArray, IsObject, ValidateNested, IsEmail, IsOptional } from 'class-validator';

export class CreateOrganizationDocumentAttrsDto {
    @IsString()
    reference: string;
  
    @IsString()
    name: string;
  
    @IsString()
    description: string;
  
    @IsString()
    owner: string;
  }
  