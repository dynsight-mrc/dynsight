import { ExtractToken } from '@common/middlewares/extractToken.middleware';
import { AccountModule } from '@modules/account/account.module';
import { AuthenticationController } from '@modules/authentication/controllers/authentication.controller';
import { BuildingModule } from '@modules/building/building.module';
import { FloorModule } from '@modules/floor/floor.module';
import { OrganizationModule } from '@modules/organization/organization.module';
import { RoomModule } from '@modules/room/room.module';
import { UserModule } from '@modules/user/user.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['src/modules/wattsense/.env', 'src/.env'],
      isGlobal: true,
    }),
    FloorModule,
    OrganizationModule,
    BuildingModule,
    RoomModule,
    UserModule,
    AccountModule,
  ],
  controllers: [AuthenticationController],
})
export class AppTestModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractToken)
      .forRoutes('accounts', 'organizations', 'rooms',"floors","users");
  }
}
