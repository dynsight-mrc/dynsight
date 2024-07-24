import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,

} from '@nestjs/common';
import { OrganizationService } from '../services/organization.service';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import {ReadOrganizationOverviewDto} from "../dtos/read-organization-overview.dto"
@UseGuards(AuthorizationGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}
  
  @Get('/overview')
  async findAllOverview(): Promise<ReadOrganizationOverviewDto[]> {
    return this.organizationService.findAllOverview();
  }
  @Post("")
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    
    return await this.organizationService.create(createOrganizationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findById(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
