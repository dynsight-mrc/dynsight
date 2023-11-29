import { Module } from '@nestjs/common';
import { RoomController } from './controllers/room.controller';
import { RoomService } from './services/room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './models/room.model';
import { PropertyModule } from '../property/property.module';
import { DeviceModule } from '../device/device.module';
import { EquipmentModule } from '../equipment/equipment.module';
import { BuildingModule } from '../building/building.module';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Room.name,
        schema: RoomSchema,
      },
    ]),
    PropertyModule,
    DeviceModule,
    EquipmentModule,
    BuildingModule,
    OrganizationModule
  ],
})
export class RoomModule {}