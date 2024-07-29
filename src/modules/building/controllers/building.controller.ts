import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BuildingService } from '../services/building.service';
import { CreateBuildingDto } from '../dtos/create-building.dto';
import { ReadBuildingDto, ReadBuildingWithDetailedFloorsList } from '../dtos/read-building.dto';
import { Building } from '../models/building.model';

@Controller('buildings')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}


  @Post()
  create(@Body() createBuildingDto: CreateBuildingDto): Promise<ReadBuildingDto> {
    return this.buildingService.create(createBuildingDto);
  }

  //GET 
  @Get("/all")
  findAll() {
    return this.buildingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) :Promise<ReadBuildingWithDetailedFloorsList|null> {
    
    
    let building =  await this.buildingService.findOne(id);
    
    return building
  }


  //GET BUILDINGS WITH ORGANIZATIONID (WITH ALL ENTITES: FLOORS=>ROOMS)
  @Get("")
  findByOrganizationId(@Query("organization") organization:string){    
    return this.buildingService.findByOrganizationId(organization)
  }
  @Patch(':id')
  update() {}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buildingService.delete();
  }
}
