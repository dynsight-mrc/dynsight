import { forwardRef, Module } from '@nestjs/common';
import { BuildingService } from './services/building.service';
import { BuildingController } from './controllers/building.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Building, BuildingSchema } from './models/building.model';
import { BuildingServiceHelper } from './services/building-helper.service';
import { FloorModule } from '@modules/floor/floor.module';
import { RoomModule } from '@modules/room/room.module';
import { MongodbModule } from '@common/databaseConnections/mongodb.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Building.name,
        schema: BuildingSchema,
      },
    ]),
    RoomModule,
    MongodbModule,
    forwardRef(() => FloorModule),
  ],
  providers: [BuildingService, BuildingServiceHelper],
  controllers: [BuildingController],
  exports: [BuildingService],
})
export class BuildingModule {}
