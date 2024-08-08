import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Building, BuildingModel } from '../models/building.model';
import { ReadOrganizationDto } from '@modules/organization/dtos/read-organization.dto';
import {
  ReadBuildingDto,
  ReadBuildingWithOrganizationDetails,
} from '../dtos/read-building.dto';

@Injectable()
export class BuildingServiceHelper {
  constructor(
    @InjectModel(Building.name) private readonly buildingModel: BuildingModel,
  ) {}

  async checkIfBuildingExists(name: string): Promise<Boolean> {
    try {
      let building = await this.buildingModel.findOne({ name });
      if (building) {
        return true;
      }
      return false;
    } catch (error) {}
  }
  async mapAsync(arr: any, fn: any): Promise<any[]> {
    return Promise.all(arr.map(fn));
  }
  replaceBuildingOranizationIdField = (building: Building) => {
    let _building = building.toJSON();
    
 
    let organization = {
      id: _building.organizationId.id,
      name: _building.organizationId.name,
      owner: _building.organizationId.owner,
    };
    _building.organization = organization;
    delete _building.organizationId;

    return _building as undefined as ReadBuildingWithOrganizationDetails;
  };
}
