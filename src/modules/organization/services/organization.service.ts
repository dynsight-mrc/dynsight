import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Organization, OrganizationModel } from '../models/organization.model';
import {
  ReadOrganizationDocumentWithDetails,
} from '../dtos/read-organization.dto';
import mongoose from 'mongoose';

import { BuildingSharedService } from '@modules/shared/services/building.shared.service';
import { ReadOrganizationDocumentDto } from '@modules/shared/dto/organization/read-organization.dto';
import { UpdateOrganizationDocumentDto } from '../dtos/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: OrganizationModel,
    private readonly buildingSharedService: BuildingSharedService,
  ) {}


  async findOneById(id: string): Promise<ReadOrganizationDocumentDto> {
    let organization;

    //Get organization
    try {
      organization = await this.organizationModel.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });
      if(!organization)return null
      return organization.toJSON();
    } catch (error) {
      throw new Error('Error occured while retrieving organization details');
    }
  }

  async findOneByIdWithDetails(
    id: string,
  ): Promise<ReadOrganizationDocumentWithDetails> {
    let organization;

    //Get organization
    try {
      organization = await this.organizationModel.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });
    } catch (error) {
      throw new Error(
        "Error while retrieving organization details!",
      );
    }
    
    //return null and quit if no organization is found
    if (!organization) {
      return null;
    }
    organization = organization.toJSON();

    //find all buildings related to the organization
    let buildings;
    try {
      buildings =
        await this.buildingSharedService.findManyWithFloorsDetails({
          organizationId: organization.id.toString(),
        });
    } catch (error) {
      throw new Error(
        "Error occured while retrieving organzation data",
      );
    }
    
    return { ...organization, buildings };
  }
  async updateOneById(id:string,data:UpdateOrganizationDocumentDto):Promise<any>{

    try {
        let updatedDoc = await this.organizationModel.findOneAndUpdate({_id:id},{$set:{...data}},{ new: true })
        
        return  updatedDoc
    } catch (error) {
      throw new Error("Error occured while updating organization")
    }
  }
}
