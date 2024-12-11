import { Injectable } from '@nestjs/common';
import { CreateAccountAttrsDto } from '../dto/create-account.dto';
import { Connection } from 'mongoose';

import { InjectConnection } from '@nestjs/mongoose';
import { ReadAccountDto } from '../dto/read-account.dto';
import { BuildingSharedService } from '@modules/shared/services/building.shared.service';
import { OrganizationSharedService } from '@modules/shared/services/organization.shared.service';
import { ReadOrganizationDocumentDto } from '@modules/shared/dto/organization/read-organization.dto';
import { RoomSharedService } from '@modules/shared/services/room.shared.service';
import { FloorSharedService } from '@modules/shared/services/floor.shared.service';
import { UserSharedService } from '@modules/shared/services/user.shared.service';
import { ReadBuildingDocumentDto } from '@modules/building/dtos/read-buildings.dto';
import { ReadFloorDocumentDto } from '@modules/shared/dto/floor/read-floor.dto';
import { ReadRoomDocumentDto } from '@modules/shared/dto/room/read-rooms.dto';
import { ReadUserDocumentDto } from '@modules/shared/dto/user/read-user.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly organizationSharedService: OrganizationSharedService,
    private readonly buildingSharedService: BuildingSharedService,
    private readonly roomSharedService: RoomSharedService,
    private readonly floorSharedService: FloorSharedService,
    private readonly userShareService: UserSharedService,
    @InjectConnection() private connection: Connection,
  ) {}
  async create(
    createAccountDto: CreateAccountAttrsDto,
  ): Promise<ReadAccountDto> {

    let {
      organization,
      building,
      location,
      floors,
      blocs: rooms,
      users,
    } = createAccountDto;

    const session = await this.connection.startSession();
    session.startTransaction();
    let organizationDoc: ReadOrganizationDocumentDto;
    try {
      organizationDoc = await this.organizationSharedService.createOne(
        organization,
        session,
      );
    } catch (error) {
      await session.abortTransaction();
 
      throw error;
    }
    let buildingDoc: ReadBuildingDocumentDto;
    try {
      //create building
      buildingDoc = await this.buildingSharedService.createOne(
        {
          ...building,
          organizationId: organizationDoc.id.toString(),
          address: location,
        },
        session,
      );
    } catch (error) {
      await session.abortTransaction();

      throw error;
    }

    let floorsDocs: ReadFloorDocumentDto[];
    try {
      //create floors
      let formatedFloors = this.floorSharedService.formatFloorsRawData({
        ...floors,
        organizationId: organizationDoc.id.toString(),
        buildingId: buildingDoc.id.toString(),
      });
      floorsDocs = await this.floorSharedService.createMany(
        formatedFloors,
        session,
      );
    } catch (error) {
         
      await session.abortTransaction();

      throw error;
    }
    let roomsDocs: ReadRoomDocumentDto[];
    try {
      let formatedRooms = this.roomSharedService.formatRoomsRawData(
        rooms,
        floorsDocs,
        buildingDoc.id.toString(),
        organizationDoc.id.toString(),
      );
      
      roomsDocs = await this.roomSharedService.createMany(
        formatedRooms,
        session,
      );
    } catch (error) {
      await session.abortTransaction();

      throw error
    }

    let usersDocs: ReadUserDocumentDto[];
    try {
      //create users
      usersDocs = await this.userShareService.createMany(
        users,
        buildingDoc.id.toString(),
        organizationDoc.id.toString(),
        session,
      );
    } catch (error) {
      await session.abortTransaction();

     throw error
    }

    await session.commitTransaction();
    session.endSession();

    return {
      organization: organizationDoc,
      building: buildingDoc,
      floors: floorsDocs,
      rooms: roomsDocs,
      users: usersDocs,
    };
  }
}
