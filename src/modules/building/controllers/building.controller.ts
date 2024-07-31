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
} from '@nestjs/common';
import { BuildingService } from '../services/building.service';
import { CreateBuildingDto } from '../dtos/create-building.dto';
import {
  ReadBuildingDto,
  ReadBuildingWithDetailedFloorsList,
} from '../dtos/read-building.dto';
import { AuthorizationGuard } from '@common/guards/authorization.guard';

@Controller('buildings')
@UseGuards(AuthorizationGuard)
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Post()
  create(
    @Body() createBuildingDto: CreateBuildingDto,
  ): Promise<ReadBuildingDto> {
    return this.buildingService.create(createBuildingDto);
  }

  // api/buildings
  //GET BUILDINGS OVERVIEW
  @Get('overview')
  findAllOverview() {
    return this.buildingService.findAllOverview();
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
