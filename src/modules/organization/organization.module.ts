import { Module } from '@nestjs/common';
import { OrganizationService } from './services/organization.service';
import { OrganizationController } from './controllers/organization.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './models/organization.model';
import { OrganizationServiceHelper } from './services/organization-helper.service';
import { BuildingModule } from '@modules/building/building.module';
import { FloorModule } from '@modules/floor/floor.module';
import { RoomModule } from '@modules/room/room.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    BuildingModule,
    FloorModule,
    RoomModule
  ],
  providers: [OrganizationService, OrganizationServiceHelper],
  controllers: [OrganizationController],
  exports: [OrganizationService],
})
export class OrganizationModule {}
