import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFloorsDto } from '../dtos/create-floors.dto';
import { FloorServiceHelper } from './floor-helper.service';
import mongoose, { Types } from 'mongoose';
import { Floor, FloorModel } from '../models/floor.model';
import {
  ReadFloorDto,
  ReadFloordWithBuildingId,
  ReadFloorWithDetailedRoomsList,
} from '../dtos/read-floor.dto';
import { RoomService } from '@modules/room/services/room.service';
import { ReadRoomWithFloorId } from '@modules/room/dtos/read-room-dto';

@Injectable()
export class FloorService {
  constructor(
    @InjectModel(Floor.name) private readonly floorModel: FloorModel,
    private readonly floorServiceHelper: FloorServiceHelper,
    private readonly roomService: RoomService,
  ) {}

  async create() {}

  async createMany(
    createFloorsDto: CreateFloorsDto,
    session?: any,
  ): Promise<ReadFloorDto[]> {
    let floorsFormatedData =
      this.floorServiceHelper.formatFloorsRawData(createFloorsDto);

    try {
      let floorsDocs = await this.floorModel.insertMany(floorsFormatedData, {
        session,
      });

      return floorsDocs as undefined as ReadFloorDto[];
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException(
          'Un ou plusieurs étages existent déja avec ces paramètres',
          HttpStatus.CONFLICT,
        );
      }
      throw new InternalServerErrorException(
        'Erreur lors de la création des étages',
      );
    }
  }
  async findAll() {
    return 'ok';
  }
  async findOneByName(name: string): Promise<Boolean> {
    try {
      let floorDoc = await this.floorModel.findOne({ name });
      if (floorDoc) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  }
  findByBuildingId = async (
    buildingId: string,
  ): Promise<ReadFloorWithDetailedRoomsList[]> => {
    let floorsDocs;
    try {
      floorsDocs = await this.floorModel
        .find({ buildingId: new mongoose.Types.ObjectId(buildingId) })

        .select({ name: 1, id: 1, buildingId: 1, number: 1 });
    } catch (error) {
      throw new Error(
        "Erreur s'est produite lors de la récupértion des données des étages",
      );
    }
    if (floorsDocs.length === 0) {
      return [];
    }

    let floors = floorsDocs.map((floor) =>
      floor.toJSON(),
    ) as undefined as ReadFloordWithBuildingId[];
    let floorsIds = floors.map((floor) => floor.id);


    let rooms:ReadRoomWithFloorId[][] = await this.floorServiceHelper.mapAsync(
      floorsIds,
      this.roomService.findByFloorId,
    );
    let floorsDetails = floors.map((floor) => {
      let roomsFiltered = rooms.flat().filter((room) => room.floorId.equals(floor.id));
      return {
        ...floor,
        rooms: roomsFiltered,
      };
    });
    return floorsDetails;
  };
  async update() {}
  async delete() {}
}
