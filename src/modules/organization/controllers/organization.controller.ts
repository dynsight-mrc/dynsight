import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrganizationService } from '../services/organization.service';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';

@Controller('organizations')
@UseGuards(AuthorizationGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get('')
  async findAll(): Promise<string[]> {
    return await this.organizationService.findAll();
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
