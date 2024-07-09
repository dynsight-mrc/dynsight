import {
    Controller,
    Get,
    Query,
    Post,
    Body,
    Put,
    Param,
    Delete,
    Patch,
    UseFilters,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';import { BuildingService } from '../services/building.service';
import { CreateBuildingDto } from '../dtos/create-building.dto';
import { ReadBuildingDto } from '../dtos/read-building.dto';
import { Building } from '../models/building.model';
import { MongoExceptionFilter } from 'src/common/errors/mongo-exception-filter';

@UseFilters(MongoExceptionFilter)

@Controller('buildings')
export class BuildingController {
    constructor(private readonly buildingService:BuildingService){

    }

    @Post()
  create(@Body() createBuildingDto:CreateBuildingDto) :Promise<Building>{
    return this.buildingService.create(createBuildingDto);
  }

  @Get()
  findAll() {
    throw new HttpException("ok",HttpStatus.INTERNAL_SERVER_ERROR)
    return this.buildingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buildingService.findOne();
  }

  @Patch(':id')
  update() {
    
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buildingService.delete();
  }
}
