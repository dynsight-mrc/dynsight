import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFloorsDto } from '../dtos/create-floors.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Floor, FloorModel } from '../models/floor.model';
import { CreateFloorDto } from '../dtos/create-floor.dto';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class FloorServiceHelper {
  constructor(
    @InjectModel(Floor.name) private readonly floorModel: FloorModel,
  ) {}

  formatFloorsRawData(floorsData: CreateFloorsDto): CreateFloorDto[] {
    
    let { number, name, organizationId, buildingId } = floorsData;

    //CHECK NAMES ARRAY AND NUMBER ARRAYS ARE NOT SAME LENGTH
    if (number.length !== name.length) {
      throw new Error(
        "Erreur s'est produite lors du formatage de la liste des étages",
      );
    }
    if (Array.from(new Set(name)).length !== name.length) {
      throw new Error('Noms des étages doivent etre uniques');
    }
    if (Array.from(new Set(number)).length !== number.length) {
      throw new Error('Numéros des étages doivent etre uniques');
    }
    return number.map((ele, index) => ({
      number: ele,
      name: name[index],
      organizationId: new mongoose.Types.ObjectId(organizationId),
      buildingId: new mongoose.Types.ObjectId(buildingId),
    }));
  }
  async forEachAsync(arr: any[], fn: Function) {
    arr.reduce(
      (promise, value) => promise.then(() => fn(value)),
      Promise.resolve(),
    );
  }
  async checkIfFloorExist(name: string): Promise<Boolean> {
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
