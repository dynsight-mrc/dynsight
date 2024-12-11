import { forwardRef, Module } from '@nestjs/common';
import { FloorController } from './controllers/floor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Floor, FloorSchema } from './models/floor.model';
import { FloorsController } from './controllers/floors.controller';
import { FloorsService } from './services/floors.service';
import { FloorService } from './services/floor.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Floor.name,
        schema: FloorSchema,
      },
    ]),
  ],
  controllers: [FloorsController, FloorController],
  providers: [FloorService, FloorsService],
  
})
export class FloorModule {}
