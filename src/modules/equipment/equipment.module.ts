import { Module } from '@nestjs/common';
import { EquipmentService } from './services/equipment.service';
import { EquipmentController } from './controllers/equipment.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Equipment, EquipmentSchema } from './models/equipment.model';
import { PropertyModule } from '../property/property.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Equipment.name,schema:EquipmentSchema}]),PropertyModule],
  providers: [EquipmentService],
  controllers: [EquipmentController],
  exports:[EquipmentService]
})
export class EquipmentModule {}
