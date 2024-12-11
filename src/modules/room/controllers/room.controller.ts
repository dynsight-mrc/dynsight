import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { RoomService } from '../services/room.service';
import { AuthorizationGuard } from '@common/guards/authorization.guard';


@Controller('rooms')
@UseGuards(AuthorizationGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('/:id')
  async findOne(@Param('id') id: string, @Query('details') details: string|undefined) {
    if (!details) {
      return this.roomService.findOneById(id);
    }
    if (details) {
      return this.roomService.findOneByIdWithDetails(id);
    }
  }
}
