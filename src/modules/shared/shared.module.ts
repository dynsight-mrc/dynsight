import { Global, Module } from '@nestjs/common';
import { FloorSharedService } from './services/floor.shared.service';
import { BuildingSharedService } from './services/building.shared.service';
import { RequestSharedService } from './services/request.shared.service';
import { MongoSharedService } from './services/mongo.shared.service';
import { FunctionSharedService } from './services/functions.shared.service';
import { RoomSharedService } from './services/room.shared.service';
import { OrganizationModule } from '@modules/organization/organization.module';
import { RoomModule } from '@modules/room/room.module';
import { FloorModule } from '@modules/floor/floor.module';
import { BuildingModule } from '@modules/building/building.module';
import { OrganizationSharedService } from './services/organization.shared.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from '@modules/room/models/room.model';
import { Floor, FloorSchema } from '@modules/floor/entities/floor.entity';
import { Building, BuildingSchema } from '@modules/building/models/building.model';
import { Organization, OrganizationSchema } from '@modules/organization/models/organization.model';
import { PasswordServiceHelper } from './services/password-helper.service';
import { UserAccount, UserSchema } from '@modules/user/models/user.model';
import { UserSharedService } from './services/user.shared.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Room.name,
        schema: RoomSchema,
      },
      {
        name: Floor.name,
        schema: FloorSchema,
      },
      {
        name: Building.name,
        schema: BuildingSchema,
      },
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
      {
        name: UserAccount.name,
        schema: UserSchema,
      },
    ]),
    RoomModule,
    FloorModule,
    BuildingModule,
    OrganizationModule,
  ],
  providers: [
    OrganizationSharedService,
    RoomSharedService,
    FloorSharedService,
    BuildingSharedService,
    RequestSharedService,
    MongoSharedService,
    FunctionSharedService,
    PasswordServiceHelper,
    UserSharedService,
  ],
  exports: [
    OrganizationSharedService,
    RoomSharedService,
    FloorSharedService,
    BuildingSharedService,
    RequestSharedService,
    MongoSharedService,
    FunctionSharedService,
    UserSharedService,
    PasswordServiceHelper
  ],
})
export class SharedModule {}
