import { Module } from '@nestjs/common';
import { RoomController } from './controllers/room.controller';
import { RoomService } from './services/room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './models/room.model';
import { BuildingModule } from '../building/building.module';
import { OrganizationModule } from '../organization/organization.module';
import { RoomServiceHelper } from './services/room-helper.service';
import { ModbusModule } from '../modbus/modbus.module';
import { WattsenseModule } from '../wattsense/wattsense.module';


@Module({
  controllers: [RoomController],
  providers: [RoomService,RoomServiceHelper],
  imports: [
    MongooseModule.forFeature([
      {
        name: Room.name,
        schema: RoomSchema,
      },
    ]),
    WattsenseModule,
    BuildingModule,
    OrganizationModule,
    ModbusModule
  ],
  exports:[RoomService],
  
})
export class RoomModule {}
