import {
  Controller,
  Get,
  Query,
  UseGuards,
  InternalServerErrorException,
  Post,
  HttpCode,
  Body,
} from '@nestjs/common';
import { BuildingsService } from '../services/buildings.service';

import { AuthorizationGuard } from '@common/guards/authorization.guard';
import { RequestSharedService } from '@modules/shared/services/request.shared.service';
import { Field } from '@modules/shared/types/query-field.type';
import { BuildingSharedService } from '@modules/shared/services/building.shared.service';
import { ReadBuildingDocumentWithFloorsDetailsDto } from '@modules/shared/dto/building/read-buildng.dto';
import { CreateBuildingWithDetailsAttrsDto } from '../dtos/create-building.dto';
import { CreateBuildingDocumentAttrsDto } from '@modules/shared/dto/building/create-building.dto';
import { ReadBuildingDocumentDto } from '../dtos/read-buildings.dto';
import { BuildingService } from '../services/building.service';

@Controller('buildings')
@UseGuards(AuthorizationGuard)
export class BuildingsController {
  constructor(
    private readonly buildingsService: BuildingsService,
    private readonly buildingService: BuildingService,

    private readonly buildingSharedService: BuildingSharedService,
    private readonly requestSharedService: RequestSharedService,
  ) {}

  @Get('')
  async find(
    @Query('fields') fields: string | undefined,
    @Query('details') details: string | undefined,
  ) {
    let formatedFields;
    try {
      formatedFields =
        this.requestSharedService.formatQueryParamsArrayToMongoFilterObject(
          fields,
        );
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors du traitement des informations des batiments!',
      );
    }

    try {
      if (!fields && !details) {
        return await this.buildingSharedService.findAll();
      }
      if (!fields && details) {
        return await this.buildingsService.findAllWithDetails();
      }
      if (fields && !details) {
        return await this.buildingSharedService.findMany(formatedFields);
      }
      if (fields && details) {
        return await this.buildingsService.findManyWithDetails(formatedFields);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des données des batiments!',
      );
    }
  }

  @Get('/with-floors')
  async findManyWithFloors(
    @Query('fields') fields: string | undefined,
  ): Promise<ReadBuildingDocumentWithFloorsDetailsDto[]> {
    try {
      
      let formatedFields =
        this.requestSharedService.formatQueryParamsArrayToMongoFilterObject(
          fields,
        );

        
      let buildings =
        await this.buildingSharedService.findManyWithFloorsDetails(
          formatedFields,
        );
        

      return buildings;
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la récupération des données de l'immeuble",
      );
    }
  }

  @Post('')
  @HttpCode(201)
  async createOne(
    
    @Body()
    createBuildingAttrsDto: CreateBuildingDocumentAttrsDto,
  ): Promise<ReadBuildingDocumentDto> {
    try {
      let building = await this.buildingSharedService.createOne(
        createBuildingAttrsDto as CreateBuildingDocumentAttrsDto,
      );

      return building;
    } catch (error) {
      
      throw new InternalServerErrorException(
        "Erreur lors de la creation du batiment",
      );
    }
  }

  @Post('with-details')
  @HttpCode(201)
  async createOneWithFloors(
    @Query('organization') organizationId: string,
    @Body()
    createBuildingWithDetailsAttrsDto: CreateBuildingWithDetailsAttrsDto,
  ): Promise<ReadBuildingDocumentWithFloorsDetailsDto> {
    try {
      let building = await this.buildingService.createOneWithFloorsDetails(
        createBuildingWithDetailsAttrsDto,
        organizationId,
      );
      return building;
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la création du batiment!",
      );
    }
  }
}
