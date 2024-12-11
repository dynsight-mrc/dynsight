import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from '../services/organization.service';
import { AuthorizationGuard } from '@common/guards/authorization.guard';
import { UpdateOrganizationDocumentDto } from '../dtos/update-organization.dto';

@UseGuards(AuthorizationGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  //api/organizations/:id
  //GET ORGANIZATION BY ID WITH ALL ENTITIES (BUILDINGS=>FLOORS=>ROOMS)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('details') details: string | undefined,
  ) {

    try {
      if (!details) {
        let organization = await this.organizationService.findOneById(id);
        return organization;
      }

      let organization =
        await this.organizationService.findOneByIdWithDetails(id);
      return organization;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error occured while retrieving organization data',
      );
    }
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateOrganizationDocumentDto: UpdateOrganizationDocumentDto,
  ) {
    try {
      let res = await this.organizationService.updateOneById(
        id,
        updateOrganizationDocumentDto,
      );
      return res;
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la mise a jour de l'organization",
      );
    }
  }
}
