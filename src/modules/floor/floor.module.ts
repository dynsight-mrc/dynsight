import { Module } from '@nestjs/common';
import { FloorController } from './controllers/floor.controller';
import { FloorService } from './services/floor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Floor, FloorSchema } from './models/floor.model';
import { FloorServiceHelper } from './services/floor-helper.service';
import { RoomModule } from '@modules/room/room.module';

@Module({
  imports:[
    MongooseModule.forFeature([{
      name:Floor.name,
      schema:FloorSchema
    }]),
    RoomModule
  ],
  controllers: [FloorController],
  providers: [FloorService,FloorServiceHelper],
  exports:[FloorService]
})
export class FloorModule {}
