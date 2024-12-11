import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Organization, OrganizationModel } from '../models/organization.model';
import { ReadOrganizationDocumentWithDetails } from '../dtos/read-organization.dto';
import { BuildingSharedService } from '@modules/shared/services/building.shared.service';
import { FunctionSharedService } from '@modules/shared/services/functions.shared.service';
import { ReadBuildingDocumentWithFloorsDetailsDto } from '@modules/shared/dto/building/read-buildng.dto';
import { ReadOrganizationDocumentDto } from '@modules/shared/dto/organization/read-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: OrganizationModel,
    private readonly buildingSharedService: BuildingSharedService,
    private readonly functions: FunctionSharedService,
  ) {}

  async findAll() {
    let organizationDocs: Organization[];
    try {
      organizationDocs = await this.organizationModel.find();
    } catch (error) {
      throw new Error('Error occured while retrieving the organizations data');
    }
    if (organizationDocs.length === 0) return [];

    let organizations = organizationDocs.map((roomDoc) =>
      roomDoc.toJSON(),
    ) as undefined as ReadOrganizationDocumentDto[];

    return organizations;
  }

  async findAllWithDetails(): Promise<ReadOrganizationDocumentWithDetails[]> {
    let organizationDocs: Organization[];
    try {
      organizationDocs = await this.organizationModel.find();

      if (!organizationDocs) return [];

      let organizations: ReadOrganizationDocumentDto[] = organizationDocs.map(
        (organization) => organization.toJSON(),
      );

      let buildingQuerieyParams = organizations.map((organization) => ({
        organizationId: organization.id,
      }));

      let buildings: ReadBuildingDocumentWithFloorsDetailsDto[][] =
        await this.functions.mapAsync(
          buildingQuerieyParams,
          this.buildingSharedService.findManyWithFloorsDetails,
        );

      let formatedOrganizations = organizations.map((organisation, index) => ({
        ...organisation,
        buildings: buildings[index],
      }));

      return formatedOrganizations;
    } catch (error) {
      throw new Error('Error occured while retrieving the organizations data');
    }
  }
}
