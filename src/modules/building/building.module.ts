import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Building, BuildingSchema } from './models/building.model';
import { FloorModule } from '@modules/floor/floor.module';
import { RoomModule } from '@modules/room/room.module';
import { MongodbModule } from '@common/databaseConnections/mongodb.module';
import { BuildingsController } from './controllers/buildings.controller';
import { BuildingsService } from './services/buildings.service';
import { BuildingService } from './services/building.service';
import { BuildingController } from './controllers/building.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Building.name,
        schema: BuildingSchema,
      },
    ]),
    MongodbModule,

  ],
  providers: [BuildingService,BuildingsService],
  controllers: [BuildingsController,BuildingController],
  exports: [BuildingService],
})
export class BuildingModule {}
