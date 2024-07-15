import { Module } from '@nestjs/common';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';
import { RoomModule } from '../room/room.module';
import { OrganizationModule } from '../organization/organization.module';
import { BuildingModule } from '../building/building.module';
import { FloorModule } from '../floor/floor.module';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbModule } from 'src/common/databaseConnections/mongodb.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [
    RoomModule,
    OrganizationModule,
    BuildingModule,
    FloorModule,
    UserModule,
  ],
})
export class AccountModule {}
