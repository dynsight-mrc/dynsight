import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization, OrganizationModel } from '../models/organization.model';

@Injectable()
export class OrganizationServiceHelper {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: OrganizationModel,
  ) {}

  async checkIfOrganizationExists(name: string): Promise<Boolean> {
    
    try {
      let organization = await this.organizationModel.findOne({ name });
      
      if (organization) {
          
        return true;
      }
      
      return false;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération du document de l\'organisation',
      );
    }
  }
}
