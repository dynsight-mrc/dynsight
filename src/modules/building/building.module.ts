import { Module } from '@nestjs/common';
import { BuildingService } from './services/building.service';
import { BuildingController } from './controllers/building.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Building, BuildingSchema } from './models/building.model';
import { BuildingServiceHelper } from './services/building-helper.service';
import { OrganizationModule } from '../organization/organization.module';
import { FloorModule } from '@modules/floor/floor.module';
import { RoomModule } from '@modules/room/room.module';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Building.name,
    schema:BuildingSchema
  }]),FloorModule,RoomModule],
  providers: [BuildingService,BuildingServiceHelper],
  controllers: [BuildingController],
  exports:[BuildingService]

})
export class BuildingModule {}
