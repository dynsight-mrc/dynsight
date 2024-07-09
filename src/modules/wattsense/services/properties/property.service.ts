import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Property, PropertyModel } from '../../models/property.model';
import { CreatePropertyDto } from '../../dtos/properties/create-property.dto';
import { ReadPropertyDto } from '../../dtos/properties/read-property.dto';
import { PropertyDto } from '../../dtos/properties/property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private readonly propertyModel: PropertyModel,
  ) {}

  async create(createPropertyDto: CreatePropertyDto) {
    const property = this.propertyModel.build({
      ...createPropertyDto,
    });

    await property.save();

    return property;
  }

  async findOrCreateOne(
    createPropertyDto: CreatePropertyDto,
  ): Promise<ReadPropertyDto> {
    let foundProperty = await this.propertyModel.findOne({
      propertyId: createPropertyDto.propertyId,
    });
    if (foundProperty)
      return foundProperty.toJSON() as undefined as ReadPropertyDto;
    const property = this.propertyModel.build({
      ...createPropertyDto,
    });

    await property.save();

    return property.toJSON() as undefined as ReadPropertyDto;
  }

  async findManyOrCreate(
    propertiesDtos: PropertyDto[],
    deviceId: string,
    equipmentId: string,
  ): Promise<string[]> {
    let properties = [];
    for (let propertyDto of propertiesDtos) {
      let foundProperty = await this.propertyModel.findOne({
        propertyId: propertyDto.propertyId,
      });
      if (foundProperty) {
        properties.push(foundProperty.id);
        continue;
      }
      const property = this.propertyModel.build({
        ...propertyDto,
        deviceId,
        equipmentId,
      });
      await property.save();
      properties.push(property.id);
    }
    return properties;
  }

  async findAll() {
    return await this.propertyModel.find();
  }
  async findOne(id: string) {
    return (
      await this.propertyModel.findById(id).populate('deviceId')
    ).populate('equipmentId');
  }
  async update(id: string) {}

  async remove(id: string) :Promise<any>{
    return await this.propertyModel.deleteOne({ _id: id });
  }
}
