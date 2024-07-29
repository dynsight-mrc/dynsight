import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFloorsDto } from '../dtos/create-floors.dto';
import { FloorServiceHelper } from './floor-helper.service';
import mongoose, { Types } from 'mongoose';
import { Floor, FloorModel } from '../models/floor.model';
import {
  ReadFloorDto,
  ReadFloordWithBuildingId,
} from '../dtos/read-floor.dto';

@Injectable()
export class FloorService {
  constructor(
    @InjectModel(Floor.name) private readonly floorModel: FloorModel,
    private readonly floorServiceHelper: FloorServiceHelper,
  ) {}

  async create() {}

  async createMany(
    createFloorsDto: CreateFloorsDto,
    session?: any,
  ): Promise<ReadFloorDto[]> {
    let floorsFormatedData =
      this.floorServiceHelper.formatFloorsRawData(createFloorsDto);

    try {
      let floorsDocs = await this.floorModel.insertMany(floorsFormatedData, {
        session,
      });

      return floorsDocs as undefined as ReadFloorDto[] ;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException(
          'Un ou plusieurs étages existent déja avec ces paramètres',
          HttpStatus.CONFLICT,
        );
      }
      throw new InternalServerErrorException(
        'Erreur lors de la création des étages',
      );
    }
  }
  async findAll() {}
  async findOneByName(name: string): Promise<Boolean> {
    try {
      let floorDoc = await this.floorModel.findOne({ name });
      if (floorDoc) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  }
  findByBuildingId = async (
    buildingId: string,
  ): Promise<ReadFloordWithBuildingId[]> => {
    try {
      let floorsDocs = await this.floorModel
        .find({ buildingId: new mongoose.Types.ObjectId(buildingId) })
        .select({ name: 1, id: 1, buildingId: 1, number: 1 })
        
      if (floorsDocs.length === 0) {
        return [];
      }
      return floorsDocs.map(floor=>floor.toJSON()) 
    } catch (error) {
      
      throw new InternalServerErrorException(
        "Erreur s'est produite lors de la récupértion des données des étages",
      );
    }
  };
  async update() {}
  async delete() {}
}
