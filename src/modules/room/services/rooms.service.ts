import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomModel } from '../models/room.model';

import { MongoSharedService } from '@modules/shared/services/mongo.shared.service';
import { RequestSharedService } from '@modules/shared/services/request.shared.service';
import {
  ReadRoomDocumentDto,
  ReadRoomDocumentWithDetails,
} from '@modules/shared/dto/room/read-rooms.dto';
import { CreateRoomsAttrsDto } from '@modules/shared/dto/room/create-rooms.dto';
import { RoomSharedService } from '@modules/shared/services/room.shared.service';
import { FloorSharedService } from '@modules/shared/services/floor.shared.service';
import { BuildingSharedService } from '@modules/shared/services/building.shared.service';
import { FunctionSharedService } from '@modules/shared/services/functions.shared.service';
import { ReadFloorDocumentDto } from '@modules/shared/dto/floor/read-floor.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: RoomModel,
    private readonly roomSharedService: RoomSharedService,
    private readonly floorSharedService: FloorSharedService,
    private readonly buildingSharedService: BuildingSharedService,
    private readonly functions: FunctionSharedService,
    private readonly mongoSharedService: MongoSharedService,
  ) {}

  /* FIND ALL REQUESTS */
  async findAll() {
    let roomsDocs: Room[];
    try {
      roomsDocs = await this.roomModel.find();
    } catch (error) {
      throw new Error('Error occured while retrieving the rooms data');
    }

    let rooms = roomsDocs.map((roomDoc) =>
      roomDoc.toJSON(),
    ) as undefined as ReadRoomDocumentDto[];

    return rooms;
  }

  async findAlllWithDetails() {
    let roomsDocs: Room[];
    let refAttributes = this.mongoSharedService.getReferenceFields(
      this.roomModel,
    );
    
    try {
      roomsDocs = await this.roomModel.find().populate(refAttributes);
    } catch (error) {
        
      throw new Error('Error occured while retrieving the rooms data');
    }

    let rooms = roomsDocs
      .map((roomDoc) => roomDoc.toJSON())
      .map(
        this.mongoSharedService.transformIdAttributes,
      ) as undefined as ReadRoomDocumentWithDetails[];

    return rooms;
  }

  async createMany(
    building: string,
    createRoomsAttrsDto: CreateRoomsAttrsDto,
  ): Promise<ReadRoomDocumentDto[]> {
    //format floors names list to [{name,building}]
    let queryParams = createRoomsAttrsDto.floors.map((floor) => [
      { name: floor, buildingId: building },
    ]);
    let floorsDocs: ReadFloorDocumentDto[];
    //get list of floors
    try {
      floorsDocs = await this.functions.mapAsync(
        queryParams,
        this.floorSharedService.findOneByFields,
      );
    } catch (error) {
      throw new Error('Error occured, selected floors do not exist');
    }


    let buildingDoc;
    try {
      buildingDoc = await this.buildingSharedService.findOneById(building);
    } catch (error) {
      
      throw new Error('Error occured while retrieving building data');
    }
    //format the list of rooms to include necessary details
    let formatedRooms = this.roomSharedService.formatRoomsRawData(
      createRoomsAttrsDto,
      floorsDocs,
      buildingDoc.id.toString(),
      buildingDoc.organizationId.toString(),
    );

    let roomsDocs;
    try {
      roomsDocs = await this.roomSharedService.createMany(formatedRooms);
    } catch (error) {
      throw new Error('Error occured while creating rooms');
    }
    return roomsDocs;
  }
}
