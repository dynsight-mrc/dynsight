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

@UseGuards(AuthorizationGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}
  
  @Get('')
  async findAll(): Promise<any[]> {
    return this.organizationService.findAll();
  }
  @Post("")
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    
    return await this.organizationService.create(createOrganizationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
