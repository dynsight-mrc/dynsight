import { Inject, Injectable } from '@nestjs/common';
import { Building, BuildingModel } from '../models/building.model';
import { ReadBuildingDocumentDto } from '../dtos/read-buildings.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { MongoSharedService } from '@modules/shared/services/mongo.shared.service';

import { ReadBuildingDocumentwithDetailsDto } from '@modules/shared/dto/building/read-buildng.dto';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectModel(Building.name) private readonly buildingModel: BuildingModel,
    @InjectConnection() private readonly connection: Connection,

    private readonly mongoSharedService: MongoSharedService,
  ) {}

  
  async findAllWithDetails(): Promise<ReadBuildingDocumentwithDetailsDto[]> {
    let buildingsDocs: Building[];
    try {
      buildingsDocs = await this.buildingModel
        .find()
        .populate(
          this.mongoSharedService.getReferenceFields(this.buildingModel),
        );
    } catch (error) {
      throw new Error('Error occured while retrieving the buildings data');
    }
    if(buildingsDocs.length>0)return []

    let buildings = buildingsDocs
      .map((building) => building.toJSON())
      .map(
        this.mongoSharedService.transformIdAttributes,
      ) as undefined as ReadBuildingDocumentwithDetailsDto[];

    return buildings;
  }

  async findManyWithDetails(
    fields: Record<string, any>,
  ): Promise<ReadBuildingDocumentwithDetailsDto[]> {
    try {
      let buildingsDoc = await this.buildingModel
        .find(fields)
        .populate(
          this.mongoSharedService.getReferenceFields(this.buildingModel),
        );

      if (buildingsDoc.length == 0) return [];
      let buildings = buildingsDoc
        .map((building) => building.toJSON())
        .map(
          this.mongoSharedService.transformIdAttributes,
        ) as undefined as ReadBuildingDocumentwithDetailsDto[];

      return buildings;
    } catch (error) {
      throw new Error('Error occured while retrieving the buildings data');
    }
  }
}
