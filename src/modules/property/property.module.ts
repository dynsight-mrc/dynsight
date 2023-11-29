import { Global, Module } from '@nestjs/common';
import { PropertyService } from './services/property.service';
import { PropertyController } from './controllers/property.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Property,  PropertySchema } from './models/property.model';

@Module({
  imports:[MongooseModule.forFeature([{name:Property.name,schema:PropertySchema}])],
  providers: [PropertyService],
  controllers: [PropertyController],
  exports:[PropertyService]
})
export class PropertyModule {}
