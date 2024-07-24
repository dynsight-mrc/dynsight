import { Module } from '@nestjs/common';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';
import { RoomModule } from '@modules/room/room.module';
import { OrganizationModule } from '@modules/organization/organization.module';
import { BuildingModule } from '@modules/building/building.module';
import { FloorModule } from '@modules/floor/floor.module';
import { UserModule } from '@modules/user/user.module';


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
