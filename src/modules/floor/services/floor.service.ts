import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Floor, FloorModel } from '../models/floor.model';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFloorsDto } from '../dtos/create-floors.dto';
import { FloorServiceHelper } from './floor-helper.service';
import { Types } from 'mongoose';
import { CreateFloorDto } from '../dtos/create-floor.dto';

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
  ): Promise<Floor[]> {
    let floorsFormatedData =
      this.floorServiceHelper.formatFloorsRawData(createFloorsDto);

    try {
      let floorsDocs = await this.floorModel.insertMany(floorsFormatedData, {
        session,
      });

      return floorsDocs;
    } catch (error) {
      
      
      if (error.code === 11000) {
        console.log( 'Un ou plusieurs étages existent déja avec ces paramètres',);
        
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
      console.log(error);
      throw new Error(error);
    }
  }
  async update() {}
  async delete() {}
}