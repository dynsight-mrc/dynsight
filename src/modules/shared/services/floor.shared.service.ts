import { Floor } from '@modules/floor/entities/floor.entity';
import { FloorModel } from '@modules/floor/models/floor.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFloorDocumentAttrsDto, CreateFloorsAttrsDto } from '../dto/floor/create-floor.dto';
import mongoose from 'mongoose';
import { RequestQueryField } from '../dto/request-quert-field.dto';
import { RequestSharedService } from './request.shared.service';
import {
  ReadFloorDocumentDto,
  ReadFloorDocumentWithDetailsDto,
} from '../dto/floor/read-floor.dto';
import { MongoSharedService } from './mongo.shared.service';

@Injectable()
export class FloorSharedService {
  constructor(
    @InjectModel(Floor.name) private readonly floorModel: FloorModel,
    private readonly mongoSharedService: MongoSharedService,
  ) {}

  formatFloorsRawData(floorsData: CreateFloorsAttrsDto): CreateFloorDocumentAttrsDto[] {
    let { number, name, organizationId, buildingId } = floorsData;

    //CHECK NAMES ARRAY AND NUMBER ARRAYS ARE NOT SAME LENGTH
    if (number.length !== name.length) {
      throw new Error(
        "Error occured when formating floors data",
      );
    }
    if (Array.from(new Set(name)).length !== name.length) {
      throw new Error('floors names must be unique');
    }
    if (Array.from(new Set(number)).length !== number.length) {
      throw new Error('floors numbers must be unqiue');
    }
    return number.map((ele, index) => ({
      number: ele,
      name: name[index],
      organizationId: new mongoose.Types.ObjectId(organizationId),
      buildingId: new mongoose.Types.ObjectId(buildingId),
    }));
  }

  async createMany(
    createFloorsDto: CreateFloorDocumentAttrsDto[],
    session?: any,
  ): Promise<ReadFloorDocumentDto[]> {
    try {
      let floorsDocs = await this.floorModel.insertMany(createFloorsDto, {
        session,
      });

      return floorsDocs.map(floor=>floor.toJSON()) as undefined as ReadFloorDocumentDto[];
    } catch (error) {
      if (error.code === 11000) {
        throw new Error(
          'Un ou plusieurs étages existent déja avec ces paramètres',
        );
      }
      throw new Error('Erreur lors de la création des étages');
    }
  }
  findOneByFields = async (
    fields: RequestQueryField[],
  ): Promise<ReadFloorDocumentDto> => {
    
    try {
      let floorDoc = await this.floorModel.findOne(fields);
      if (floorDoc) {
        return floorDoc.toJSON();
      }
      return null;
    } catch (error) {
      throw new Error("Error while retrieving the floor data");
    }
  };
  findOneById = async (id: string): Promise<ReadFloorDocumentDto> => {
    try {
      let floorDoc = await this.floorModel.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });
      if (floorDoc) {
        return floorDoc.toJSON();
      }
      return null;
    } catch (error) {
      throw new Error("Error while retrieving the floor data");
    }
  };
  
  async findManyWithDetails(
    fields: Record<string, any>,
  ): Promise<ReadFloorDocumentWithDetailsDto[]> {
    
    try {
      let floorsDocs = await this.floorModel
        .find(fields)
        .populate(this.mongoSharedService.getReferenceFields(this.floorModel));

      if (floorsDocs.length == 0) return [];
      let floors = floorsDocs
        .map((floor) => floor.toJSON())
        .map(
          this.mongoSharedService.transformIdAttributes,
        ) as undefined as ReadFloorDocumentWithDetailsDto[];

      return floors;
    } catch (error) {
      throw new Error('Error occured while retrieving the floors data');
    }
  }
}
