import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthorizationGuard } from '@common/guards/authorization.guard';
import { BuildingService } from '../services/building.service';

import {
  ReadBuildingDocumentwithDetailsDto,
  ReadBuildingDocumentWithFloorsDetailsDto,
} from '@modules/shared/dto/building/read-buildng.dto';
import { ReadBuildingDocumentDto } from '../dtos/read-buildings.dto';

import { BuildingSharedService } from '@modules/shared/services/building.shared.service';

@Controller('buildings')
@UseGuards(AuthorizationGuard)
export class BuildingController {
  constructor(
    private readonly buildingService: BuildingService,
    private readonly buildingSharedService: BuildingSharedService,
  ) {}

  @Get('/:id')
  async findOne(
    @Param('id') id: string,
    @Query('details') details: string,
  ): Promise<ReadBuildingDocumentwithDetailsDto | ReadBuildingDocumentDto> {
    try {
      if (!details) {
        let building = (await this.buildingSharedService.findOneById(
          id,
        )) as ReadBuildingDocumentDto;
        return building;
      }

      let building = (await this.buildingSharedService.findOneByIdWithDetails(
        id,
      )) as ReadBuildingDocumentwithDetailsDto;
      return building;
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la récupération des données De l'immeuble",
      );
    }
  }

  @Get('/:id/with-floors')
  async findOneWithFloors(
    @Param('id') id: string,
  ): Promise<ReadBuildingDocumentWithFloorsDetailsDto> {
    try {
      let building =
        await this.buildingSharedService.findOneWithFloorsDetails(id);
      return building;
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la récupération des données de l'immeuble",
      );
    }
  }
}
