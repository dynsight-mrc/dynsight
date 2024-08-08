import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  InternalServerErrorException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { BuildingService } from '../services/building.service';
import {
  CreateBuildingDto,
  CreateBuildingWithRelatedEntities,
} from '../dtos/create-building.dto';
import {
  ReadBuildingDto,
  ReadBuildingWithDetailedFloorsList,
  ReadCreatedBuildingDto,
} from '../dtos/read-building.dto';
import { AuthorizationGuard } from '@common/guards/authorization.guard';
import { Building } from '../models/building.model';

@Controller('buildings')
@UseGuards(AuthorizationGuard)
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  /* @Post()
  create(
    @Body() createBuildingDto: CreateBuildingDto,
  ): Promise<ReadBuildingDto> {
    return this.buildingService.create(createBuildingDto);
  } */
  @Post('')
  @HttpCode(201)
  async create(
    @Query('organization') organization: string,
    @Body() createBuildingDto: CreateBuildingWithRelatedEntities,
  ): Promise<ReadCreatedBuildingDto> {
    try {
      let buildingDetails =
        await this.buildingService.createBuildingWithRelatedEntites(
          createBuildingDto,
          organization,
        );
      return buildingDetails;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  // api/buildings
  //GET BUILDINGS OVERVIEW
  @Get('overview')
  async findAllOverview() {
    try {
      let buildingsOverview = await this.buildingService.findAllOverview();
      return buildingsOverview;
    } catch (error) {
      throw new InternalServerErrorException(
        "erreur s'est produite lors de la récupérations des données des immeubles",
      );
    }
  }

  //api/buildings/:id
  //GET BUILDING BY ID (WITH ALL ENTITES: FLOORS=>ROOMS)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ReadBuildingWithDetailedFloorsList | null> {
    let building = await this.buildingService.findOne(id);

    return building;
  }

  //api/buildings?organization
  //GET BUILDINGS WITH ORGANIZATIONID
  @Get('')
  findByOrganizationId(@Query('organization') organization: string) {
    return this.buildingService.findByOrganizationId(organization);
  }

  @Patch(':id')
  update() {}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buildingService.delete();
  }
}
