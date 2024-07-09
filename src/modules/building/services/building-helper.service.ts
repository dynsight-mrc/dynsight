import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Building, BuildingModel } from '../models/building.model';

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
}
