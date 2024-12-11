import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';

import { RoomModule } from './modules/room/room.module';
import { FloorModule } from './modules/floor/floor.module';
import { BuildingModule } from './modules/building/building.module';

import { WattsenseModule } from './modules/wattsense/wattsense.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrganizationModule } from './modules/organization/organization.module';
import { ModbusModule } from './modules/modbus/modbus.module';

import { AuthenticationModule } from './modules/authentication/authentication.module';
import { ExtractToken } from './common/middlewares/extractToken.middleware';
import { AccountModule } from './modules/account/account.module';
import { UserModule } from './modules/user/user.module';
import { MongodbModule } from './common/databaseConnections/mongodb.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['src/modules/wattsense/.env', 'src/.env'],
      isGlobal: true,
    }),
    //MongooseModule.forRoot('mongodb://dynsight-user:dynsight-user@38.242.254.49:60213/dynsight'),
    //MongooseModule.forRoot('mongodb://mongo-dynsight-1:27017,mongo-dynsight-2:27017,mongo-dynsight-3:27017/dynsight?replicaSet=myReplicaSet'),
    MongodbModule,
    OrganizationModule,
    FloorModule,
    BuildingModule,
    RoomModule,
    WattsenseModule,
    ModbusModule,
    AuthenticationModule,
    AccountModule,
    UserModule,
    SharedModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExtractToken).forRoutes('accounts',"users", 'buildings','organizations', 'rooms');
  }
}
