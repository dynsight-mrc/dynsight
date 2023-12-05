import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRoomDto } from '../dtos/create-room.dto';
import { ReadRoomDto } from '../dtos/read-room-dto';
import { UpdateRoomPropertiesDto } from '../dtos/update-room-property.dto';
import { RoomService } from '../services/room.service';
import { RequestValidationError } from 'src/common/errors/request-validation-error';
import { UpdateRoomZone } from '../dtos/update-room-zone.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    console.log(createRoomDto);

    let results;
    try {
      results = await this.roomService.create(createRoomDto);
    } catch (error) {
      console.log(error.message);

      if (error instanceof RequestValidationError)
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: error.message,
          },
          HttpStatus.CONFLICT,
        );
    }
    return results;
  }

  @Get()
  async findAll(): Promise<ReadRoomDto[]> {
    return await this.roomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Patch('updateproperties')
  async updateProperties(
    @Query('roomId') roomId: string,
    @Body() updateRoomPropertyDto: UpdateRoomPropertiesDto[],
  ) {
    try {
      return await this.roomService.updateProperties(
        roomId,
        updateRoomPropertyDto,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Patch('updatezone')
  updateZone(
    @Query('roomId') roomId: string,
    @Body() updateRoomZone: UpdateRoomZone,
  ) {
    return this.roomService.updateZone(roomId, updateRoomZone);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }

  @Delete('')
  async removeAll() {
    return await this.roomService.removeAll();
  }
}
