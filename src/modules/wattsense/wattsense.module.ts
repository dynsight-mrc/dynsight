import { Module } from '@nestjs/common';
import { WattsenseController } from './controllers/wattsense.controller';
import { WattsenseService } from './services/wattsense.service';
import { HttpModule } from '@nestjs/axios';
import { WattsenseApiAuthenticator } from './services/helper/wattsense-api-authentication.service';
import { WattsenseApiHelper } from './services/helper/wattsense-api-helper.service';
import { DeviceService } from './services/devices/device.service';
import { EquipmentService } from './services/equipments/equipment.service';
import { PropertyService } from './services/properties/property.service';
import { DeviceController } from './controllers/devices/device.controller';
import { EquipmentController } from './controllers/equipments/equipment.controller';
import { PropertyController } from './controllers/properties/property.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from './models/property.model';
import { Device, DeviceSchema } from './models/device.model';
import { Equipment, EquipmentSchema } from './models/equipment.model';
enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}
type WattsenseApiConfig = {
  method: HttpMethods.GET;
  relativePath: '/v1/devices';
};

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
      { name: Device.name, schema: DeviceSchema },
      { name: Equipment.name, schema: EquipmentSchema },
    ]),
  ],
  exports:[DeviceService,EquipmentService,PropertyService],
  controllers: [
    WattsenseController,
    DeviceController,
    EquipmentController,
    PropertyController,
  ],
  providers: [
    WattsenseService,
    WattsenseApiHelper,
    {
      useFactory: (): WattsenseApiAuthenticator => {
        return new WattsenseApiAuthenticator(
          HttpMethods.GET,
          process.env.API_SECRET,
          process.env.API_KEY,
        );
      },
      provide: 'WATTSENSE_GET_API',
    },
    DeviceService,
    EquipmentService,
    PropertyService,
  ],

})
export class WattsenseModule {}
