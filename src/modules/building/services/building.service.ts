import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Building, BuildingModel } from '../models/building.model';
import {
  CreateBuildingDto,
  CreateBuildingWithRelatedEntities,
} from '../dtos/create-building.dto';
import {
  ReadBuildingDto,
  ReadBuildingOverview,
  ReadBuildingWithDetailedFloorsList,
  ReadBuildingWithOrganizationDetails,
  ReadCreatedBuildingDto,
} from '../dtos/read-building.dto';
import {
  getConnectionToken,
  InjectConnection,
  InjectModel,
  MongooseModule,
} from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
import { BuildingServiceHelper } from './building-helper.service';
import { FloorService } from '@modules/floor/services/floor.service';
import { RoomService } from '@modules/room/services/room.service';

import {
  ReadRoomDto,
  ReadRoomWithFloorId,
} from '@modules/room/dtos/read-room-dto';
import {
  ReadFloorDto,
  ReadFloordWithBuildingId,
} from '@modules/floor/dtos/read-floor.dto';


@Injectable()
export class BuildingService {
  constructor(
    @InjectModel(Building.name) private readonly buildingModel: BuildingModel,
    private readonly buildingServiceHelper: BuildingServiceHelper,
    private readonly roomService: RoomService,
    @Inject(forwardRef(()=>FloorService)) private readonly floorService:FloorService,
    @InjectConnection() private readonly connection: Connection,
  ) {}
 
  async createBuildingWithRelatedEntites(
    createBuildingDto: CreateBuildingWithRelatedEntities,
    organization?: string,
  ): Promise<ReadCreatedBuildingDto> {
    let { building: _building, location, floors, blocs } = createBuildingDto;
    const session = await this.connection.startSession();
    session.startTransaction();
    let buildingDoc: Building;
    try {
      buildingDoc = this.buildingModel.build({
        ..._building,
        organizationId: new mongoose.Types.ObjectId(organization),
        address: location,
      });
      await buildingDoc.save({ session });
    } catch (error) {
      await session.abortTransaction();
      if (error.code === 11000) {
        throw new Error('Immeuble existe déja avec ces paramètres');
      }
      throw new Error("Erreur lors de la création de l'immeuble");
    }
    let building: ReadBuildingDto = buildingDoc.toJSON();
    let floorsDocs: ReadFloorDto[];
    try {
      floorsDocs = await this.floorService.createMany(
        {
          organizationId: new mongoose.Types.ObjectId(organization),
          buildingId: new mongoose.Types.ObjectId(building.id),
          ...floors,
        },
        session,
      );
    } catch (error) {
      await session.abortTransaction();
      if (error.code === 409) {
        throw new Error('Étage(s) existe(nt) déja avec ces paramètres');
      }
      throw new Error('Erreur lors de la création des étages');
    }

    let blocsDocs: ReadRoomDto[];
    try {
      blocsDocs = await this.roomService.createMany(
        blocs,
        floorsDocs,
        buildingDoc.id,
        new mongoose.Types.ObjectId(organization),
        session,
      );
    } catch (error) {
      await session.abortTransaction();
      if (error.code === 409) {
        throw new Error('Bloc(s) existe(nt) déja avec ces paramètres');
      }
      throw new Error('Erreur lors de la création des blocs');
    }

    await session.commitTransaction();
    await session.endSession();

    return {
      organization: new mongoose.Types.ObjectId(organization),
      building,
      floors: floorsDocs,
      blocs: blocsDocs,
    };
  }

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
    let buildingDoc;
    try {
      buildingDoc = await this.buildingModel
        .findOne({
          _id: new mongoose.Types.ObjectId(id),
        })
        .populate({ path: 'organizationId', select: ['name', 'owner', 'id'] });
    
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur s'est produite lors de la récuperation de l'immeuble",
      );
    }
    if (!buildingDoc) {
      return null;
    }
    
    //transform object with _id to object with id
    let building =
      this.buildingServiceHelper.replaceBuildingOranizationIdField(buildingDoc);
    
    //map from buildings documets => array of buildings ids

    //for each building id in buildingsIds, get the related floors
    let floorsDocs: ReadFloordWithBuildingId[];
    try {
      floorsDocs = await this.floorService.findByBuildingId(
        building.id.toString(),
      );
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
        'Erreur sest produite lors de la récupération des données des blocs',
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
        .populate({ path: 'organizationId', select: ['owner', 'name', '_id'] });
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

    let floorsIds = floors.flat().map((floor) => floor.id);
    let rooms: ReadRoomWithFloorId[][];
    try {
      rooms = await this.buildingServiceHelper.mapAsync(
        floorsIds,
        this.roomService.findByFloorId,
      );
    } catch (error) {
      throw new Error(
        "Erreur s'est produite lors de la récupération  des données des blocs",
      );
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
