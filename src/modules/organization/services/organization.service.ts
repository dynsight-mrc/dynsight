import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization, OrganizationModel } from '../models/organization.model';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { ReadOrganizationDto } from '../dtos/read-organization.dto';
import { OrganizationServiceHelper } from './organization-helper.service';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: OrganizationModel,
    private readonly organizationServiceHelper: OrganizationServiceHelper,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
    session?: any,
  ): Promise<Organization> {
    let existingOrganization =
      await this.organizationServiceHelper.checkIfOrganizationExists(
        createOrganizationDto.name,
      );

    if (existingOrganization) {
      throw new Error('Organisation existe déja !');
    }

    try {
      const organizationDoc = this.organizationModel.build({
        ...createOrganizationDto,
      });

      await organizationDoc.save({ session });

      return organizationDoc;
    } catch (error) {
      
      if(error.code===11000){
        
        throw new HttpException(
          "Organisation existe déja avec ces paramètres",HttpStatus.CONFLICT
        );
      }
      throw new InternalServerErrorException(
        "Erreur lors de la création du l'organisation"
      );
    }
  }

  async findById(id: string): Promise<ReadOrganizationDto> {
    try {
      return await this.organizationModel.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la récupération du document de l'organisation",
      );
    }
  }
  async findAll(): Promise<any[]> {
    // Your actual implementation
    return await this.organizationModel.find({});
  }
}
