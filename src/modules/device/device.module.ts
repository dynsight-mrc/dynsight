import { Module } from '@nestjs/common';
import { DeviceService } from './services/device.service';
import { DeviceController } from './controllers/device.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './models/device.model';

@Module({
  imports:[MongooseModule.forFeature([{name:Device.name,schema:DeviceSchema}])],
  providers: [DeviceService],
  controllers: [DeviceController],
  exports:[DeviceService]
})
export class DeviceModule {}
