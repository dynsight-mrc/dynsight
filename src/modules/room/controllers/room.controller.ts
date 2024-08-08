import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { RoomService } from '../services/room.service';

import { AuthorizationGuard } from '../../../common/guards/authorization.guard';

@Controller('rooms')
@UseGuards(AuthorizationGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('')
  async findByBuildingId(@Query('building') building: string) {
    try {
      let rooms = await this.roomService.findByBuildingId(building);
      return rooms;
    } catch (error) {
      throw new Error(
        "Erreur s'est produite lors de la récupération des données des blocs",
      );
    }
  }

  @Get('all')
  findAll() {
    try {
    } catch (error) {
      throw new Error(
        "Erreur s'est produite lors de la récupération des données des blocs",
      );
    }
  }

  @Get('overview')
  findAllOverview() {
    return this.roomService.findAllOverview();
  }
}
