import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthorizationGuard } from '@common/guards/authorization.guard';
import { FloorSharedService } from '@modules/shared/services/floor.shared.service';
import { FunctionSharedService } from '@modules/shared/services/functions.shared.service';
import { ReadFloorDocumentDto } from '@modules/shared/dto/floor/read-floor.dto';
import { BuildingSharedService } from '@modules/shared/services/building.shared.service';
import { RoomSharedService } from '@modules/shared/services/room.shared.service';
import { CreateRoomsAttrsDto } from '@modules/shared/dto/room/create-rooms.dto';
import { RoomsService } from '../services/rooms.service';
import { Field } from '@modules/shared/types/query-field.type';
import {
  ReadRoomDocumentDto,
  ReadRoomDocumentWithDetails,
} from '@modules/shared/dto/room/read-rooms.dto';
import { RequestSharedService } from '@modules/shared/services/request.shared.service';
import { MongoSharedService } from '@modules/shared/services/mongo.shared.service';

@Controller('rooms')
@UseGuards(AuthorizationGuard)
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly roomSharedService: RoomSharedService,
    private readonly requestSharedService: RequestSharedService,
  ) {}

  @Get('')
  async find(
    @Query('fields') fields?: string | undefined,
    @Query('details') details?: string | undefined,
  ): Promise<ReadRoomDocumentDto[] | ReadRoomDocumentWithDetails[]> {
    let formatedFields: Record<string, any>;
    try {
      formatedFields =
        this.requestSharedService.formatQueryParamsArrayToMongoFilterObject(
          fields,
        );
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur avec les informations du filtrage des blocs!',
      );
    }
    let rooms: any;
    try {
      if (!fields && !details) {
        
        rooms = this.roomsService.findAll();
      }
      if (!fields && details) {
        

        rooms = this.roomsService.findAlllWithDetails();
      }
      if (fields && !details) {
        
        rooms = this.roomSharedService.findMany(formatedFields);
      }
      if (fields && details) {
        

        rooms =
          await this.roomSharedService.findManyWithDetails(formatedFields);
      }
      return rooms;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des données des étages',
      );
    }
  }

  @Post('/many')
  async createMany(
    @Query('building') building: string,
    @Body() createRoomsAttrsDto: CreateRoomsAttrsDto,
  ): Promise<ReadRoomDocumentDto[]> {
    //format floors names list to [{name,building}]
    try {
      let roomsDocs = await this.roomsService.createMany(
        building,
        createRoomsAttrsDto,
      );
      return roomsDocs;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la création des blocs',
      );
    }
  }
}
