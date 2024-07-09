import {  Injectable } from '@nestjs/common';
import { Site, SiteModel } from '../models/site.model';
import { CreateSiteDto } from '../dtos/create-site.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SiteService {
  constructor(@InjectModel(Site.name) private readonly siteModel: SiteModel) {}
  async create(createSiteDto: CreateSiteDto) {}
  async findAll() {}
  async findOne() {}
  async update() {}
  async delete() {}
}
