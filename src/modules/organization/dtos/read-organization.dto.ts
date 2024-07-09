import { IsString } from 'class-validator';

export class ReadOrganizationDto {
  @IsString()
  id: string;
  
  @IsString()
  reference: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  owner: string;
}
