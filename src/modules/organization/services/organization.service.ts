import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Type,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Organization, OrganizationModel } from '../models/organization.model';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { ReadOrganizationDto } from '../dtos/read-organization.dto';
import { OrganizationServiceHelper } from './organization-helper.service';
import { ReadOrganizationOverviewDto } from '../dtos/read-organization-overview.dto';
import mongoose, { Connection, Types } from 'mongoose';
import {
  Building,
  BuildingModel,
} from '@modules/building/models/building.model';
import { BuildingService } from '@modules/building/services/building.service';
import { FloorService } from '@modules/floor/services/floor.service';
import { RoomService } from '@modules/room/services/room.service';
import { isInstance } from 'class-validator';
import { Floor } from '@modules/floor/models/floor.model';
import { Room } from '@modules/room/models/room.model';
@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: OrganizationModel,
    private readonly organizationServiceHelper: OrganizationServiceHelper,
    private readonly floorService: FloorService,
    private readonly roomService: RoomService,
    private readonly buildingService: BuildingService,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
    session?: any,
  ): Promise<Organization> {
    let existingOrganization =
      await this.organizationServiceHelper.checkIfOrganizationExists(
        createOrganizationDto.name,
      );

    if (existingOrganization) {
      throw new Error('Organisation existe déja !');
    }

    try {
      const organizationDoc = this.organizationModel.build({
        ...createOrganizationDto,
      });

      await organizationDoc.save({ session });

      return organizationDoc;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException(
          'Organisation existe déja avec ces paramètres',
          HttpStatus.CONFLICT,
        );
      }
      throw new InternalServerErrorException(
        "Erreur lors de la création du l'organisation",
      );
    }
  }

  async findById(id: string): Promise<any> {
    let organization: Organization;

    //Get organization 
    try {
      organization = await this.organizationModel.findOne({ _id: new mongoose.Types.ObjectId(id) });
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur s'est produite lors lors de la récupération des données de l'organisation",
      );
    }

    //return null and quit if no organization is found
    if (!organization) {
      return null;
    }

    //transform object with _id to object with id
    organization = organization.toJSON();


    //find all buildings related to the organization 
    let buildingsDocs: Building[];
    try {
      buildingsDocs = await this.buildingService.findByOrganizationId(
        organization.id,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur s'est produite lors de la récupération  des données des immeubles",
      );
    }
    //map from buildings documets => array of buildings ids
    let buildingsIds = buildingsDocs.map((building) => building.id);

    //for each building id in buildingsIds, get the related floors
    let floorsDocs: Partial<Floor>[][];
    try {
      floorsDocs = await this.organizationServiceHelper.mapAsync(
        buildingsIds,
        this.floorService.findByBuildingId,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur s'est produite lors de la récupértion des données des étages",
      );
    }

    //map from floors documents => array of floors ids
    let floorsIds = floorsDocs.flat().map((floor) => floor.id);
    
    //for each floorIds, get all the related blocs
    let roomsDocs:Partial<Room>[][]
    try {
      roomsDocs = await this.organizationServiceHelper.mapAsync(
        floorsIds,
        this.roomService.findByFloorId,
      );
      
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur sest produite lors de la récupérations des données des blocs',
      );
    }
    
  
    

    //create final object {oganization, buildings:[{..data,floors:[{...data,rooms:[]}]}]}
    let floors = floorsDocs.flat().map((floor) => ({
      ...floor,
      rooms: roomsDocs.flat().filter((room) => room.floorId.equals(floor.id)),
    }));

    let buildings = buildingsDocs.map((building) => ({
      ...building,
      floors: floors.filter((floor) => floor.buildingId.equals(building.id)),
    }));

    return { ...organization, buildings };
  }
  async findAllOverview(): Promise<ReadOrganizationOverviewDto[]> {
    try {
      //let organizations = await this.organizationModel.find({});
      let organizations: ReadOrganizationOverviewDto[] =
        await this.organizationModel.aggregate([
          {
            $lookup: {
              from: 'buildings',
              localField: '_id',
              foreignField: 'organizationId',
              as: 'buildings',
            },
          },
          {
            $addFields: {
              numberOfBuildings: {
                $size: '$buildings',
              },
              totalSurface: { $sum: '$buildings.surface' },
            },
          },
          {
            $project: {
              id: '$_id',
              name: 1,
              reference: 1,
              description: 1,
              owner: 1,
              numberOfBuildings: 1,
              totalSurface: 1,
            },
          },
        ]);
      return organizations;
    } catch (error) {
      throw new InternalServerErrorException(
        'error lors du récupération des données des organizations',
      );
    }
  }
}
