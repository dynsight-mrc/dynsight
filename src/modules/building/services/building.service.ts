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
      if(error.code===11000){
        console.log( "Nom d'immeuble existe déja dans cet organisation");
        
        throw new HttpException(
          "Immeuble existe déja avec ces paramètres",HttpStatus.CONFLICT
        );
      }
      throw new InternalServerErrorException(
        "Erreur lors de la création du l'organisation"
      );
       
    }
  }
  async findAll() {}
  async findOne() {}
  async update() {}
  async delete() {}
}
