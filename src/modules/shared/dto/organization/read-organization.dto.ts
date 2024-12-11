import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ReadOrganizationDocumentDto {
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
  
}



