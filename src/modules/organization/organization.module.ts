import { Module } from '@nestjs/common';
import { OrganizationService } from './services/organization.service';
import { OrganizationController } from './controllers/organization.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './models/organization.model';
import { OrganizationServiceHelper } from './services/organization-helper.service';



@Module({
  imports:[MongooseModule.forFeature([{name:Organization.name,schema:OrganizationSchema}])],
  providers: [OrganizationService,OrganizationServiceHelper,
 
  ],
  controllers: [OrganizationController],
  exports:[OrganizationService,MongooseModule]
})
export class OrganizationModule {}
