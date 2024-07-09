import { Module } from '@nestjs/common';
import { SiteController } from './controllers/site.controller';
import { SiteService } from './services/site.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './models/site.model';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Site.name,
    schema:SiteSchema
  }])],
  controllers: [SiteController],
  providers:[SiteService]
})
export class SiteModule {}
