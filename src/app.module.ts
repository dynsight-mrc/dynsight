import { Module, ValidationPipe } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { RoomModule } from './modules/room/room.module';
import { FloorModule } from './modules/floor/floor.module';
import { BuildingModule } from './modules/building/building.module';
import { APP_PIPE } from '@nestjs/core';
import { DeviceModule } from './modules/device/device.module';
import { PropertyModule } from './modules/property/property.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { WattsenseModule } from './modules/wattsense/wattsense.module';
import { ConfigModule } from '@nestjs/config';
import { OrganizationModule } from './modules/organization/organization.module';
import { ModbusModule } from './modules/modbus/modbus.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:["src/modules/wattsense/.env"]
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/dynsight'),
    FloorModule,
    BuildingModule,
    RoomModule,
    DeviceModule,
    PropertyModule,
    EquipmentModule,
    WattsenseModule,
    OrganizationModule,
    ModbusModule
  ],
  controllers: [],
  providers: [{provide:APP_PIPE,useClass:ValidationPipe}],
})
export class AppModule {}
