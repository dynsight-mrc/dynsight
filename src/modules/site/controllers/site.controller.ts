import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CreateSiteDto } from '../dtos/create-site.dto';
import { UpdateSiteDto } from '../dtos/update-site.dto';

import { SiteService } from '../services/site.service';

@Controller('site')
export class SiteController {
  constructor(private siteService: SiteService) {}

  @Post()
  create(@Body() createUserDto: CreateSiteDto) {
    return this.siteService.create(CreateSiteDto);
  }

  @Get()
  findAll() {
    return this.siteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siteService.findOne();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateSiteDto) {
    return this.siteService.update();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siteService.delete();
  }
}
