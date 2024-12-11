import {Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './models/room.model';

import { RoomServiceHelper } from './services/room-helper.service';
import { ModbusModule } from '../modbus/modbus.module';
import { WattsenseModule } from '../wattsense/wattsense.module';
import { RoomController } from './controllers/room.controller';
import { RoomService } from './services/room.service';
import { RoomsController } from './controllers/rooms.controller';
import { RoomsService } from './services/rooms.service';


@Module({
  controllers: [RoomController,RoomsController],
  providers: [RoomsService,RoomService,RoomServiceHelper],
  imports: [
    MongooseModule.forFeature([
      {
        name: Room.name,
        schema: RoomSchema,
      },
    ]),
    WattsenseModule,
    ModbusModule,
  ],
  
  exports:[RoomService],
  
})
export class RoomModule {}
