import { IsString } from 'class-validator';

export class UpdateOrganizationDocumentDto {
  @IsString()
  reference: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  owner: string;
}
