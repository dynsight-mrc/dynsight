import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Building, BuildingModel } from '../models/building.model';
import { CreateBuildingDto } from '../dtos/create-building.dto';
import { ReadBuildingDto } from '../dtos/read-building.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class BuildingService {
  constructor(
    @InjectModel(Building.name) private readonly buildingModel: BuildingModel,
  ) {}

  async create(
    createBuildingDto: CreateBuildingDto,
    session?: any,
  ): Promise<Building> {
    try {
      let buildingDoc = this.buildingModel.build(createBuildingDto);

      await buildingDoc.save({ session });

      return buildingDoc;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException(
          'Immeuble existe déja avec ces paramètres',
          HttpStatus.CONFLICT,
        );
      }
      throw new InternalServerErrorException(
        "Erreur lors de la création de l'immeuble",
      );
    }
  }
  async findAll() {}
  async findOne() {}
  async findByOrganizationId(organizationId: Types.ObjectId): Promise<Building[]> {
    try {
      let buildings =  await this.buildingModel.find({
        organizationId: new mongoose.Types.ObjectId(organizationId),
      }).select({organizationId:0});
      if(buildings.length===0){
        return []
      }
      
      return buildings.map(building=>building.toJSON())
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur s'est produite lors de la récupération  des données des immeubles",
      );
    }
  }
  async update() {}
  async delete() {}
}
