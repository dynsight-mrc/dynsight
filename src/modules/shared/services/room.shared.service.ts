import { Injectable } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';
import {
  ReadRoomDocumentDto,
  ReadRoomDocumentWithDetails,
} from '../dto/room/read-rooms.dto';
import { ReadFloorDocumentDto } from '../dto/floor/read-floor.dto';
import {
  CreateRoomDocumentAttrsDto,
  CreateRoomsAttrsDto,
} from '../dto/room/create-rooms.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomModel } from '@modules/room/models/room.model';
import { MongoSharedService } from './mongo.shared.service';
import { FunctionSharedService } from './functions.shared.service';

@Injectable()
export class RoomSharedService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: RoomModel,
    private readonly mongoSharedService: MongoSharedService,
    private readonly functionSharedService: FunctionSharedService,
  ) {}

  formatRoomsRawData(
    roomsData: CreateRoomsAttrsDto,
    floorsDocs: ReadFloorDocumentDto[],
    buildingId: string,
    organizationId: string,
  ): CreateRoomDocumentAttrsDto[] {
    let { name, floors, type, surface } = roomsData;

    if (
      !this.functionSharedService.checkAllObjectFieldsHasSameLength(
        roomsData as undefined as Record<string, (string | number)[]>,
      )
    ) {
      throw new Error('Inadéquation des valeurs des blocs');
    }
    //CHECK IF THERE IS NO DOUBLE NAME VALUES
    if (Array.from(new Set(name)).length !== name.length) {
      throw new Error('Noms des blocs doivent etre uniques');
    }

    //CHECK IF CREATED FLOORS PROVIDED HAS INCLUDES NAMES FROM THE BLOCS ASSOCIATED FLOORS
    if (
      !floors
        .map((ele) => floorsDocs.map((ele) => ele.name).includes(ele))
        .every((ele) => ele === true)
    ) {
      throw new Error("erreur lors du mappage des identifiants d'étages");
    }

    return name.map((ele, index) => ({
      name: ele,
      organizationId: new mongoose.Types.ObjectId(organizationId),
      buildingId: new mongoose.Types.ObjectId(buildingId),
      floorId: floorsDocs.find((ele) => ele.name === floors[index]).id,
      ...(type[index] && { type: type[index] }),
      ...(surface[index] && { surface: surface[index] }),
    }));
  }

  async createMany(
    createRoomsDto: CreateRoomDocumentAttrsDto[],
    session?: any,
  ) {
    try {
      let blocsDocs = await this.roomModel.insertMany(createRoomsDto, {
        session,
      });

      return blocsDocs as undefined as ReadRoomDocumentDto[];
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('A bloc alredy exists with these parameters');
      }
      throw new Error('Error occured while creating rooms!');
    }
  }

  async findMany(fields: Record<string, any>): Promise<ReadRoomDocumentDto[]> {
    try {
      let rooms = await this.roomModel.find(
        this.mongoSharedService.transformObjectStringIdsToMongoObjectIds(
          fields,
        ),
      );
      if (rooms.length == 0) return [];
      return rooms.map((room) =>
        room.toJSON(),
      ) as undefined as ReadRoomDocumentDto[];
    } catch (error) {
      throw new Error('Error occured while retrieving the rooms data');
    }
  }

  findManyWithDetails = async (fields: Record<string, any>) => {
    try {
      let referenceFields = this.mongoSharedService.getReferenceFields(
        this.roomModel,
      );

      let roomsDocs = await this.roomModel
        .find(fields)
        .populate(referenceFields);

      if (roomsDocs.length == 0) return [];

      let rooms = roomsDocs
        .map((room) => room.toJSON())
        .map(
          this.mongoSharedService.transformIdAttributes,
        ) as undefined as ReadRoomDocumentWithDetails[];
      return rooms;
    } catch (error) {
      throw new Error('Error occured while retrieving the rooms data');
    }
  };
}
