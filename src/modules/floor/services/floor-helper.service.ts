import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateFloorsAttrsDto,
  CreateFloorsDto,
} from '../dtos/create-floors.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Floor, FloorModel } from '../models/floor.model';
import { CreateFloorDto } from '../dtos/create-floor.dto';
import mongoose from 'mongoose';
import { CreateFloorDocumentAttrsDto } from '@modules/shared/dto/floor/create-floor.dto';

@Injectable()
export class FloorServiceHelper {
  constructor(
    @InjectModel(Floor.name) private readonly floorModel: FloorModel,
  ) {}

   
 
  async checkIfFloorExist(name: string): Promise<Boolean> {
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
  async createOneFloor(floor: CreateFloorDto) {
    let c = Promise.all([]);
    let floorExist = this.checkIfFloorExist(floor.name);
    if (floorExist) {
      throw new HttpException(
        'Un étage déja exist avec un nom pareil',
        HttpStatus.CONFLICT,
      );
    }
    let floorDoc = this.floorModel.build({ ...floor });
    await floorDoc.save();

    return floorDoc;
  }
}
