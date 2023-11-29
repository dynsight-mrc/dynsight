import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Property, PropertyModel } from '../models/property.model';
import { CreatePropertyDto } from '../dtos/create-property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private readonly propertyModel: PropertyModel,
  ) {}

  async create(createPropertyDto: CreatePropertyDto) {
    const property = this.propertyModel.build({
      propertyId: createPropertyDto.propertyId,
      deviceId: createPropertyDto.deviceId,
      equipmentId: createPropertyDto.equipmentId,
      name: createPropertyDto.name,
      unit: createPropertyDto.unit,
      config: createPropertyDto.config,
      accessType: createPropertyDto.accessType,
      disabled: createPropertyDto.disabled,
    });

    await property.save();

    return property;
  }
  async findAll() {
    return await this.propertyModel.find();
  }
  async findOne(id: string) {
    return (await this.propertyModel.findById(id).populate("deviceId")).populate('equipmentId');
  }
  async update(id:string) {}
  async remove(id: string) {
    return await this.propertyModel.deleteOne({ _id: id });
  }
}
