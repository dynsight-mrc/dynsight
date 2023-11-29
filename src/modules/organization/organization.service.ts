import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './models/organization.model';
import { Model } from 'mongoose';

@Injectable()
export class OrganizationService {
    constructor(@InjectModel(Organization.name) private readonly organizationModel:Model<Organization>){

    }
    async findAll(): Promise<string[]> {
        // Your actual implementation
        return ['Room1', 'Room2', 'Room3'];
      }
}
