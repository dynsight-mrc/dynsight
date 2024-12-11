import {
  Organization,
  OrganizationModel,
} from '@modules/organization/models/organization.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrganizationDocumentAttrsDto } from '../dto/organization/create-organization.dto';
import { ReadOrganizationDocumentDto } from '../dto/organization/read-organization.dto';

@Injectable()
export class OrganizationSharedService {
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
      throw new Error('Error occured while retrieving the organization data');
    }
  }

  async createOne(
    createOrganizationDto: CreateOrganizationDocumentAttrsDto,
    session?: any,
  ): Promise<ReadOrganizationDocumentDto> {
    try {
      let existingOrganization = await this.checkIfOrganizationExists(
        createOrganizationDto.name,
      );

      if (existingOrganization) {
        let error = (new Error("Organization already exists") as any)
        error.code = 11000
        throw error
      }

      const organizationDoc = this.organizationModel.build({
        ...createOrganizationDto,
      });

      await organizationDoc.save({ session });

      return organizationDoc.toJSON() as undefined as ReadOrganizationDocumentDto;
    } catch (error) {
      
      
      if (error.code === 11000) {
        throw new Error('Organization already exists');
      }
      throw new Error('Error occured while creating organization');
    }
  }
}
