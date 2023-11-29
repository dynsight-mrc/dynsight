import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './models/organization.model';



@Module({
  imports:[MongooseModule.forFeature([{name:Organization.name,schema:OrganizationSchema}])],
  providers: [OrganizationService],
  controllers: [OrganizationController],
  exports:[OrganizationService]
})
export class OrganizationModule {}
