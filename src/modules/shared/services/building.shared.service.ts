import {
  Building,
  BuildingModel,
} from '@modules/building/models/building.model';
import { Inject, Injectable } from '@nestjs/common';
import { MongoSharedService } from './mongo.shared.service';
import mongoose from 'mongoose';
import {
  ReadBuildingDocumentDto,
  ReadBuildingDocumentwithDetailsDto,
  ReadBuildingDocumentWithFloorsDetailsDto,
} from '../dto/building/read-buildng.dto';
import { FunctionSharedService } from './functions.shared.service';
import { ReadFloorDocumentWithDetailsDto } from '../dto/floor/read-floor.dto';
import { FloorSharedService } from './floor.shared.service';
import { RoomSharedService } from './room.shared.service';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBuildingDocumentAttrsDto } from '../dto/building/create-building.dto';
import { ReadRoomDocumentWithDetails } from '../dto/room/read-rooms.dto';

@Injectable()
export class BuildingSharedService {
  constructor(
    @InjectModel(Building.name) private readonly buildingModel: BuildingModel,
    private readonly mongoSharedService: MongoSharedService,
    private readonly floorSharedService: FloorSharedService,
    private readonly roomSharedService: RoomSharedService,
    private readonly functions: FunctionSharedService,
  ) {}
  async findAll(): Promise<ReadBuildingDocumentDto[]> {
    let buildingsDocs: Building[];
    try {
      buildingsDocs = await this.buildingModel.find();
    } catch (error) {
      throw new Error('Error occured while retrieving the buildings data');
    }
    if(buildingsDocs.length===0)return []

    let buildings = buildingsDocs.map((building) =>
      building.toJSON(),
    ) as undefined as ReadBuildingDocumentDto[];

    return buildings;
  }

  async findOneById(id: string): Promise<ReadBuildingDocumentDto> {
    try {
      let buildingDoc =  await this.buildingModel.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });
      if(!buildingDoc) return null
      return buildingDoc.toJSON()
    } catch (error) {
      throw new Error("Error while retrieving building data");
    }
  }
  async findOneByIdWithDetails(
    id: string,
  ): Promise<ReadBuildingDocumentwithDetailsDto|null> {
    let buildingsRef = this.mongoSharedService.getReferenceFields(
      this.buildingModel,
    );
    try {
      let buildingDoc = await this.buildingModel
        .findOne({ _id: new mongoose.Types.ObjectId(id) })
        .populate(buildingsRef);
        if(!buildingDoc) return null
      let building: ReadBuildingDocumentwithDetailsDto =
        this.mongoSharedService.transformIdAttributes(buildingDoc.toJSON());
      return building;
    } catch (error) {
      throw new Error("Error while retrieving building data");
    }
  }
  findMany = async (
    fields: Record<string, any>,
  ): Promise<ReadBuildingDocumentDto[]> => {
    try {
      let buildings = await this.buildingModel.find(fields);

      if (fields.length == 0) return [];

      return buildings.map((building) =>
        building.toJSON(),
      ) as undefined as ReadBuildingDocumentDto[];
    } catch (error) {
      throw new Error('Error occured while retrieving the buildings data');
    }
  };
  findOneWithFloorsDetails = async (
    id: string,
  ): Promise<ReadBuildingDocumentWithFloorsDetailsDto|null> => {
    let building: ReadBuildingDocumentwithDetailsDto|null;

    try {
      building = await this.findOneByIdWithDetails(id);
    } catch (error) {
      throw new Error('Error occured while retrieving building floors data');
    }
    
    if(!building) return null

    let floorsDocs: ReadFloorDocumentWithDetailsDto[];

    try {
      floorsDocs = await this.floorSharedService.findManyWithDetails(
        this.mongoSharedService.transformObjectStringIdsToMongoObjectIds({
          buildingId: id,
        }),
      );
    } catch (error) {
      throw new Error('Error occured while retrieving building floors data');
    }


    let roomsDocs: ReadRoomDocumentWithDetails[][];
    let queryParams = floorsDocs.map((floor) => ({
      buildingId: floor.building.id,
      floorId: floor.id,
    }));
    
    try {
      roomsDocs = await this.functions.mapAsync(
        queryParams,
        this.roomSharedService.findManyWithDetails,
      );
    } catch (error) {
      throw new Error('Error occured while retrieving building rooms data');
    }

    
    let floors = floorsDocs.map((floor) => ({
      ...floor,
      rooms: roomsDocs.flat().filter((room) => room.floor.id.equals(floor.id)),
    }));

    return {
      ...building,
      floors,
    };
  };
  findManyWithFloorsDetails = async (
    fields: Record<string, any>,
  ): Promise<ReadBuildingDocumentWithFloorsDetailsDto[]> => {
    try {
      let buildingsDoc = await this.buildingModel.find(fields);

      if (buildingsDoc.length == 0) return [];

      let buildings = buildingsDoc
        .map((building) => building.toJSON())
        /* .map(
          this.mongoSharedService.transformIdAttributes,
        ) as undefined as ReadBuildingDocumentWithFloorsDetailsDto[];
 */

      let buildingsIds: string[] = buildings.map((building) =>
        building.id.toString(),
      );


      let buildingdsWithFloorsDetails: ReadBuildingDocumentWithFloorsDetailsDto[] =
        await this.functions.mapAsync(
          buildingsIds,
          this.findOneWithFloorsDetails,
        );

      return buildingdsWithFloorsDetails;
    } catch (error) {
      throw new Error('Error occured while retrieving the buildings data');
    }
  };
  async checkIfBuildingExists(name: string): Promise<Boolean> {
    try {
      let building = await this.buildingModel.findOne({ name });
      if (building) {
        return true;
      }
      return false;
    } catch (error) {}
  }

  async createOne(
    createBuildingDocumentAttrsDto: CreateBuildingDocumentAttrsDto,
    session?: any,
  ): Promise<ReadBuildingDocumentDto> {
    try {
      let buildingDoc = this.buildingModel.build({
        ...createBuildingDocumentAttrsDto,
        organizationId: new mongoose.Types.ObjectId(
          createBuildingDocumentAttrsDto.organizationId,
        ),
      });

      let building = await buildingDoc?.save({ session });

      return building as undefined as ReadBuildingDocumentDto;
    } catch (error) {
      
      if (error.code === 11000) {
       let error  = new Error('Building already exists with these details');
       (error as any).code  = 11000
       throw error
      }
      throw new Error('Error occured while creating building');
    }
  }
}

