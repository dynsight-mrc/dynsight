import { Module } from '@nestjs/common';
import { FloorController } from './controllers/floor.controller';
import { FloorService } from './services/floor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Floor, FloorSchema } from './models/floor.model';
import { Building, BuildingSchema } from '../building/models/building.model';
import { BuildingModule } from '../building/building.module';
import { FloorServiceHelper } from './services/floor-helper.service';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports:[
    MongooseModule.forFeature([{
      name:Floor.name,
      schema:FloorSchema
    }])
  ,BuildingModule,OrganizationModule],
  controllers: [FloorController],
  providers: [FloorService,FloorServiceHelper],
  exports:[FloorService]
})
export class FloorModule {}
