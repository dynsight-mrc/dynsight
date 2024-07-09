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
} from '@nestjs/common';
import { FloorService } from '../services/floor.service';
import { CreateFloorsDto } from '../dtos/create-floors.dto';

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

  @Get()
  findAll() {
    return this.floorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.floorService.update();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.floorService.delete();
  }
}
