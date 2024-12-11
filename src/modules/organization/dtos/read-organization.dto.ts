import { ReadBuildingDocumentDto, ReadBuildingDocumentWithFloorsDetailsDto } from '@modules/shared/dto/building/read-buildng.dto';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';



export class ReadOrganizationDocumentWithDetails{
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

  buildings: ReadBuildingDocumentWithFloorsDetailsDto[];
}


