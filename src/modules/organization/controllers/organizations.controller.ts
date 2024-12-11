import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from '../services/organizations.service';
import { OrganizationSharedService } from '@modules/shared/services/organization.shared.service';
import { CreateOrganizationDocumentAttrsDto } from '@modules/shared/dto/organization/create-organization.dto';

//@UseGuards(AuthorizationGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly organizationSharedService: OrganizationSharedService,
  ) {}

  //api/organizations/overview
  //GET LIST OF ALL ORGANIZATION (OVERVIEW FORMAT = BRIEFING)
  @Get('')
  async find(@Query('details') details: string | undefined) {
    try {
      if (!details) {
        let organizations = await this.organizationsService.findAll();
        return organizations;
      }

      let organizations = await this.organizationsService.findAllWithDetails();
      return organizations;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error occured while retrieving organizations data',
      );
    }
  }
  @Post('')
  async create(
    @Body() createOrganizationDto: CreateOrganizationDocumentAttrsDto,
  ) {
    try {
      let reponse = await this.organizationSharedService.createOne(
        createOrganizationDto,
      );
      return reponse;
    } catch (error) {
      throw new HttpException(
        'Error occured while creating the organization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
