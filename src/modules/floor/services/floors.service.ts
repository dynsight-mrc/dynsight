import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Floor, FloorModel } from '../models/floor.model';

import { MongoSharedService } from '@modules/shared/services/mongo.shared.service';

import {
  ReadFloorDocumentDetailsWithRoomsDto,
  ReadFloorDocumentDto,
  ReadFloorDocumentWithDetailsDto,
  ReadFloorDocumentWithRoomsDetailsDto,
} from '@modules/shared/dto/floor/read-floor.dto';
import { CreateFloorDocumentAttrsDto } from '@modules/shared/dto/floor/create-floor.dto';
import { FloorService } from './floor.service';
import { FunctionSharedService } from '@modules/shared/services/functions.shared.service';
import { CreateFloorsWithRoomsDto } from '../dtos/create-floors.dto';
import { ReadRoomDocumentDto } from '@modules/shared/dto/room/read-rooms.dto';
import { BuildingSharedService } from '@modules/shared/services/building.shared.service';
import { FloorSharedService } from '@modules/shared/services/floor.shared.service';
import { RoomSharedService } from '@modules/shared/services/room.shared.service';

@Injectable()
export class FloorsService {
  constructor(
    @InjectModel(Floor.name) private readonly floorModel: FloorModel,
    @InjectConnection() private connection: Connection,
    private readonly mongoSharedService: MongoSharedService,
    private readonly functions: FunctionSharedService,
    private floorService: FloorService,
    private buildingSharedService: BuildingSharedService,
    private floorSharedService: FloorSharedService,
    private roomSharedService: RoomSharedService,
  ) {}

  async findAll(): Promise<ReadFloorDocumentDto[]> {
    try {
      let floorsDocs: Floor[];

      floorsDocs = await this.floorModel.find();

      if (floorsDocs.length === 0) {
        return [];
      }

      let floors = floorsDocs.map((floor) =>
        floor.toJSON(),
      ) as undefined as ReadFloorDocumentDto[];

      return floors;
    } catch (error) {
      throw new Error('Error while retrieving the floors data');
    }
  }
  async findAllWithDetails(): Promise<ReadFloorDocumentWithDetailsDto[]> {
    let floorsDocs: Floor[];
    try {
      floorsDocs = await this.floorModel
        .find()
        .populate(this.mongoSharedService.getReferenceFields(this.floorModel));
    } catch (error) {
      throw new Error('Error occured while retrieving the floors data');
    }
    if (floorsDocs.length === 0) {
      return [];
    }

    let floors = floorsDocs
      .map((floor) => floor.toJSON())
      .map(
        this.mongoSharedService.transformIdAttributes,
      ) as undefined as ReadFloorDocumentWithDetailsDto[];

    return floors;
  }
  async findMany(fields: Record<string, any>): Promise<ReadFloorDocumentDto[]> {
    try {
      let floors = await this.floorModel.find(fields);
    
      
      if (floors.length == 0) return [];
      return floors.map((floor) =>
        floor.toJSON(),
      ) as undefined as ReadFloorDocumentDto[];
    } catch (error) {
      throw new Error('Error occured while retrieving the floors data');
    }
  }
  async findManyWithRooms(
    fields: Record<string, any>,
  ): Promise<ReadFloorDocumentDetailsWithRoomsDto[]> {
    try {
      let floorsDocs = await this.floorModel.find(fields);

      if (floorsDocs.length == 0) return [];
      let floors = floorsDocs
        .map((floor) => floor.toJSON())
        /* .map(
          this.mongoSharedService.transformIdAttributes,
        ) as undefined as ReadFloorDocumentWithDetailsDto[]; */

      let floorsIds: string[] = floors.map((floor) => floor.id.toString());
      let floorsWithRoomsDetails: ReadFloorDocumentDetailsWithRoomsDto[] =
        await this.functions.mapAsync(
          floorsIds,
          this.floorService.findOneWithRooms,
        );
      return floorsWithRoomsDetails;
    } catch (error) {
      throw new Error('Error occured while retrieving the buildings data');
    }
  }
  /* async createMany(
    createFloorsDocumentsDto: CreateFloorDocumentAttrsDto[],
    session?: any,
  ): Promise<ReadFloorDocumentDto[]> {
    try {
      let floorsDocs = await this.floorModel.insertMany(
        createFloorsDocumentsDto,
        {
          session,
        },
      );

      return floorsDocs as undefined as ReadFloorDocumentDto[];
    } catch (error) {
      if (error.code === 11000) {
        throw new Error(
          'Un ou plusieurs étages existent déja avec ces paramètres',
        );
      }
      throw new Error('Erreur lors de la création des étages');
    }
  } */

  async createManyWithRooms(
    building: string,
    createFloorsWithRoomsDto: CreateFloorsWithRoomsDto,
  ): Promise<{ floors: ReadFloorDocumentDto[]; rooms: ReadRoomDocumentDto[] }> {
    let { floors, blocs: rooms } = createFloorsWithRoomsDto;

    let buildingDoc = await this.buildingSharedService.findOneById(building);

    let formatedFloors = this.floorSharedService.formatFloorsRawData({
      ...floors,
      buildingId: buildingDoc.id.toString(),
      organizationId: buildingDoc.organizationId.toString(),
    });

    let floorsDocs: ReadFloorDocumentDto[];
    try {
      floorsDocs = await this.floorSharedService.createMany(formatedFloors);
    } catch (error) {
      throw new Error('Error while creating floors');
    }

    let formatedRooms = this.roomSharedService.formatRoomsRawData(
      rooms,
      floorsDocs,
      buildingDoc.id.toString(),
      buildingDoc.organizationId.toString(),
    );
    let roomsDocs;
    try {
      roomsDocs = await this.roomSharedService.createMany(formatedRooms);
      return {
        floors: floorsDocs,
        rooms: roomsDocs,
      };
    } catch (error) {
      throw new Error('Error while creating blocs');
    }
  }
}
