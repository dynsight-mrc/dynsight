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
  InternalServerErrorException,
} from '@nestjs/common';
import { FloorService } from '../services/floor.service';
import { CreateFloorsDto } from '../dtos/create-floors.dto';
import { ReadFloordWithBuildingId, ReadFloorWithDetailedRoomsList } from '../dtos/read-floor.dto';

@Controller('floors')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}
  /* @Post()
  create() {
    return this.floorService.create();
  } */

  @Post()
  createMany(@Body() createFloorsDto: CreateFloorsDto): any {
    return this.floorService.createMany(createFloorsDto);
  }

  @Get('')
  async findByBuilding(
    @Query('building') building: string,
  ): Promise<ReadFloorWithDetailedRoomsList[]> {
  
    try {
      let floors = await this.floorService.findByBuildingId(building);
      return floors;
    } catch (error) {
      console.log(error);
      
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des données des étages !',
      );
    }
  }

  @Get("")
  findAll() {
    return this.floorService.findAll();
  }
  

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.floorService.update();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.floorService.delete();
  }
}
