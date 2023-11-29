import { Module } from '@nestjs/common';
import { EquipmentService } from './services/equipment.service';
import { EquipmentController } from './controllers/equipment.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Equipment, EquipmentSchema } from './models/equipment.model';

@Module({
  imports:[MongooseModule.forFeature([{name:Equipment.name,schema:EquipmentSchema}])],
  providers: [EquipmentService],
  controllers: [EquipmentController],
  exports:[EquipmentService]
})
export class EquipmentModule {}
