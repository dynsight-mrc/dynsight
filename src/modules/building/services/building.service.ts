import {  Injectable } from '@nestjs/common';
import { Building, BuildingModel } from '../models/building.model';
import { MongoSharedService } from '@modules/shared/services/mongo.shared.service';
import {
  CreateBuildingWithDetailsAttrsDto,
} from '../dtos/create-building.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
  ReadFloorDocumentDto,
  ReadFloorDocumentWithDetailsDto,
} from '@modules/shared/dto/floor/read-floor.dto';
import { FloorSharedService } from '@modules/shared/services/floor.shared.service';
import { RoomSharedService } from '@modules/shared/services/room.shared.service';
import {
  ReadBuildingDocumentDto,
  ReadBuildingDocumentwithDetailsDto,
  ReadBuildingDocumentWithFloorsDetailsDto,
} from '@modules/shared/dto/building/read-buildng.dto';
import { BuildingSharedService } from '@modules/shared/services/building.shared.service';

@Injectable()
export class BuildingService {
  constructor(
    @InjectModel(Building.name) private readonly buildingModel: BuildingModel,
    private readonly mongoSharedService: MongoSharedService,
    private readonly floorSharedService: FloorSharedService,
    private readonly buildingSharedService: BuildingSharedService,
    private readonly roomSharedService: RoomSharedService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  /* async findOneById(id: string): Promise<ReadBuildingDocumentDto> {
    try {
      let buildingDoc = await this.buildingModel.findOne({ _id: id });
      if(!buildingDoc) return null
      return buildingDoc.toJSON();
    } catch (error) {
      throw new Error('Error occured while retrieving the building data');
    }
  }
  async findOneByIdWithDetails(
    id: string,
  ): Promise<ReadBuildingDocumentwithDetailsDto> {
    let buildingRefs = this.mongoSharedService.getReferenceFields(
      this.buildingModel,
    );
    try {
      let buildingDoc = await this.buildingModel
        .findOne({ _id: id })
        .populate(buildingRefs);
      if(!buildingDoc) return null
      let building = this.mongoSharedService.transformIdAttributes(
        buildingDoc.toJSON(),
      );
      return building;
    } catch (error) {
      throw new Error('Error occured while retrieving the building data');
    }
  } */

  async createOneWithFloorsDetails(
    createBuildingWithDetailsAttrsDto: CreateBuildingWithDetailsAttrsDto,
    organizationId?: string,
  ): Promise<ReadBuildingDocumentWithFloorsDetailsDto> {
      
    let {
      building: _building,
      location,
      floors,
      blocs: rooms,
    } = createBuildingWithDetailsAttrsDto;

    const session = await this.connection.startSession();
    
    
    session.startTransaction();
    let buildingDoc: ReadBuildingDocumentDto;

    try {
      buildingDoc = await this.buildingSharedService.createOne({
        ..._building,
        organizationId,
        address: location,
      });
    } catch (error) {
     
      await session.abortTransaction();
      if (error.code === 11000) {
        throw new Error('Building already exists with this details');
      }
      throw new Error('Error occured while creating building');
    }

    let floorsDocs: ReadFloorDocumentDto[];
    try {
      let formatedFloors = this.floorSharedService.formatFloorsRawData({
        ...floors,
        organizationId,
        buildingId: buildingDoc.id.toString(),
      });
      floorsDocs = await this.floorSharedService.createMany(
        formatedFloors,
        session,
      );
    } catch (error) {
      await session.abortTransaction();

      throw new Error('Error occured while creating building floors');
    }

    let roomsDocs: any[];
    try {
      let formatedRooms = this.roomSharedService.formatRoomsRawData(
        rooms,
        floorsDocs,
        buildingDoc.id.toString(),
        organizationId,
      );
      roomsDocs = await this.roomSharedService.createMany(
        formatedRooms,
        session,
      );
    } catch (error) {
      await session.abortTransaction();

      throw new Error('Error occured while creating building rooms');
    }

    await session.commitTransaction();

    let createdBuilding =
      await this.buildingSharedService.findOneWithFloorsDetails(
        buildingDoc.id.toString(),
      );

    return createdBuilding;
  }
}
