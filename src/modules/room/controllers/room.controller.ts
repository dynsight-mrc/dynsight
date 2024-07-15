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
}
