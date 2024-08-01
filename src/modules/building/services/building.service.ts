import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Building, BuildingModel } from '../models/building.model';
import { CreateBuildingDto } from '../dtos/create-building.dto';
import {
  ReadBuildingDto,
  ReadBuildingOverview,
  ReadBuildingWithDetailedFloorsList,
} from '../dtos/read-building.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { BuildingServiceHelper } from './building-helper.service';
import { Floor } from '@modules/floor/entities/floor.entity';
import { FloorService } from '@modules/floor/services/floor.service';
import { Room } from '@modules/room/models/room.model';
import { RoomService } from '@modules/room/services/room.service';
import { FloorModel } from '@modules/floor/models/floor.model';

import { ReadRoomWithFloorId } from '@modules/room/dtos/read-room-dto';
import { ReadFloordWithBuildingId } from '@modules/floor/dtos/read-floor.dto';

@Injectable()
export class BuildingService {
  constructor(
    @InjectModel(Building.name) private readonly buildingModel: BuildingModel,
    private readonly buildingServiceHelper: BuildingServiceHelper,
    private readonly floorService: FloorService,
    private readonly roomService: RoomService,
  ) {}

  async create(
    createBuildingDto: CreateBuildingDto,
    session?: any,
  ): Promise<ReadBuildingDto> {
    try {
      let buildingDoc = this.buildingModel.build(createBuildingDto);

      await buildingDoc.save({ session });

      return buildingDoc as undefined as ReadBuildingDto;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException(
          'Immeuble existe déja avec ces paramètres',
          HttpStatus.CONFLICT,
        );
      }
      throw new InternalServerErrorException(
        "Erreur lors de la création de l'immeuble",
      );
    }
  }
  async findAll() {}

  findOne = async (
    id: string,
  ): Promise<ReadBuildingWithDetailedFloorsList | null> => {
    let building;
    try {
      building = await this.buildingModel.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });
    } catch (error) {

      throw new InternalServerErrorException(
        "Erreur s'est produite lors de la récuperation de l'immeuble",
      );
    }
    if (!building) {
      return null;
    }
    //transform object with _id to object with id
    building = building.toJSON() as ReadBuildingDto;
    //map from buildings documets => array of buildings ids

    //for each building id in buildingsIds, get the related floors
    let floorsDocs: ReadFloordWithBuildingId[];
    try {
      floorsDocs = await this.floorService.findByBuildingId(building.id);
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur s'est produite lors de la récupértion des données des étages",
      );
    }

    //map from floors documents => array of floors ids
    let floorsIds = floorsDocs.map((floor) => floor.id);

    //for each floorIds, get all the related blocs
    let roomsDocs: ReadRoomWithFloorId[][];
    try {
      roomsDocs = await this.buildingServiceHelper.mapAsync(
        floorsIds,
        this.roomService.findByFloorId,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur sest produite lors de la récupérations des données des blocs',
      );
    }

    //create final object {oganization, buildings:[{..data,floors:[{...data,rooms:[]}]}]}
    let floors = floorsDocs.map((floor) => ({
      ...floor,
      rooms: roomsDocs.flat().filter((room) => room.floorId.equals(floor.id)),
    }));

    return {
      ...building,
      floors,
    };
  };
  async findByOrganizationId(
    organizationId: string,
  ): Promise<ReadBuildingDto[]> {
    try {
      let buildings = await this.buildingModel
        .find({
          organizationId: new mongoose.Types.ObjectId(organizationId),
        })
        .select({ organizationId: 0 });
      if (buildings.length === 0) {
        return [];
      }

      return buildings.map((building) => building.toJSON());
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur s'est produite lors de la récupération  des données des immeubles",
      );
    }
  }

  async findAllOverview(): Promise<ReadBuildingOverview[]> {
    let buildingsDocs: Building[];
    try {
      buildingsDocs = await this.buildingModel
        .find()
        .populate({ path: 'organizationId', select: ['owner', 'name'] });
    } catch (error) {
      throw new Error(
        "Erreur s'est produite lors de la récupération  des données des immeubles",
      );
    }
    if (buildingsDocs.length === 0) {
      return [];
    }

    let buildings = buildingsDocs.map(
      this.buildingServiceHelper.replaceBuildingOranizationIdField,
    );

    let buildingsIds = buildings.map((building) => building.id);
    let floors: ReadFloordWithBuildingId[][];
    try {
      floors = await this.buildingServiceHelper.mapAsync(
        buildingsIds,
        this.floorService.findByBuildingId,
      );
    } catch (error) {
      throw new Error(
        "Erreur s'est produite lors de la récupération  des données des étages",
      );
    }
  
    
    //let buildingsDocs = await this.findOne('669e2326656ca12333bad333')
    let floorsIds = floors.flat().map((floor) => floor.id);
    let rooms: ReadRoomWithFloorId[][];
    try {
      rooms = await this.buildingServiceHelper.mapAsync(
        floorsIds,
        this.roomService.findByFloorId,
      );
    } catch (error) {
      throw new Error("Erreur s'est produite lors de la récupération  des données des blocs")
    }
      
    let floorsMapped = floors.flat().map((floor) => {
      let roomsMapped = rooms
        .flat()
        .filter((room) => room.floorId.equals(floor.id));

      return {
        ...floor,
        rooms: roomsMapped,
      };
    });

    let buildingsOverview = buildings.map((building) => {
      let floorsFiltered = floorsMapped.filter((floor) =>
        floor.buildingId.equals(building.id),
      );

      return {
        ...building,
        numberOfFloors: floorsFiltered.length,
        numberOfRooms: floorsFiltered.map((floor) => floor.rooms).length,
      };
    }) as undefined as ReadBuildingOverview[];
    return buildingsOverview;
  }
  async update() {}
  async delete() {}
}
