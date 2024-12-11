import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  CreateFloorsAttrsDto,
  CreateFloorsDto,
  CreateFloorsWithRoomsDto,
} from '../dtos/create-floors.dto';
import { BuildingSharedService } from '@modules/shared/services/building.shared.service';
import { RequestSharedService } from '@modules/shared/services/request.shared.service';
import { FloorsService } from '../services/floors.service';
import { RoomSharedService } from '@modules/shared/services/room.shared.service';
import { ReadRoomDocumentDto } from '@modules/shared/dto/room/read-rooms.dto';
import { FloorSharedService } from '@modules/shared/services/floor.shared.service';
import {
  ReadFloorDocumentDetailsWithRoomsDto,
  ReadFloorDocumentDto,
} from '@modules/shared/dto/floor/read-floor.dto';

@Controller('floors')
export class FloorsController {
  constructor(
    private readonly floorsService: FloorsService,
    private readonly floorSharedService: FloorSharedService,
    private readonly requestSharedService: RequestSharedService,
  ) {}

  @Post('')
  @HttpCode(201)
  async createMany(@Body() createFloorsAttrsDto: CreateFloorsAttrsDto) {
    let formatedFloors =
      this.floorSharedService.formatFloorsRawData(createFloorsAttrsDto);
      
    try {
      let floors = await this.floorSharedService.createMany(formatedFloors);
      return floors;
    } catch (error) {
     
      throw new InternalServerErrorException(
        'Erreur lors de la création des étages',
      );
    }
  }

  @Post('with-rooms')
  async createManyWithRooms(
    @Query('building') building: string,
    @Body() createFloorsWithRoomsDto: CreateFloorsWithRoomsDto,
  ): Promise<{ floors: ReadFloorDocumentDto[]; rooms: ReadRoomDocumentDto[] }> {
    try {
      let floors = await this.floorsService.createManyWithRooms(
        building,
        createFloorsWithRoomsDto,
      );
      return floors
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la création des étages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
   
  }

  @Get('')
  async find(
    @Query('fields') fields: string | undefined,
    @Query('details') details: string | undefined,
  ) {
    let formatedFields
    try {
    formatedFields = 
      this.requestSharedService.formatQueryParamsArrayToMongoFilterObject(
        fields,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors du traitement des informations blocs!',
      );
    }
    try {
      if (!fields && !details) {
        return await this.floorsService.findAll();
      }
      if (!fields && details) {
        return await this.floorsService.findAllWithDetails();
      }
      if (fields && !details) {
        return await this.floorsService.findMany(formatedFields);
      }
      if (fields && details) {
        return await this.floorSharedService.findManyWithDetails(formatedFields);
      }
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des données des étages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/with-rooms')
  async findManyWithRooms(
    @Query('fields') fields: string | undefined,
  ): Promise<ReadFloorDocumentDetailsWithRoomsDto[]> {
   

    try {
      let formatedFields =
      this.requestSharedService.formatQueryParamsArrayToMongoFilterObject(
        fields,
      );
      let floors = await this.floorsService.findManyWithRooms(formatedFields);

      return floors;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des données des étages',
      );
    }
  }
}
