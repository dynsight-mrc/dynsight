import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Equipment, EquipmentModel } from '../models/equipment.model';
import { CreateEquipmentDto } from '../dtos/create-equipment.dto';
import { ReadEquipmentDto } from '../dtos/read-equipment.dto';
import { EquipmentWithNestedProperties } from '../dtos/equipment-with-nested-properties.dto';
import { PropertyService } from 'src/modules/property/services/property.service';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectModel(Equipment.name)
    private readonly equipmentModel: EquipmentModel,
    private readonly propertyService: PropertyService,
  ) {}

  async create(
    createEuipmentDto: CreateEquipmentDto,
  ): Promise<ReadEquipmentDto> {
    const equipment = this.equipmentModel.build({
      deviceId: createEuipmentDto.deviceId,
      equipmentId: createEuipmentDto.equipmentId,
      name: createEuipmentDto.name,
    });

    await equipment.save();
    return equipment as undefined as ReadEquipmentDto;
  }

  async findOrCreateOne(
    createEquipmentDto: CreateEquipmentDto,
  ): Promise<ReadEquipmentDto> {
    let foundEquipment = await this.equipmentModel.findOne({
      equipmentId: createEquipmentDto.equipmentId,
    });
    if (foundEquipment)
      return foundEquipment.toJSON() as undefined as ReadEquipmentDto;

    const equipment = this.equipmentModel.build({
      deviceId: createEquipmentDto.deviceId,
      equipmentId: createEquipmentDto.equipmentId,
      name: createEquipmentDto.name,
    });

    await equipment.save();
    return equipment.toJSON() as undefined as ReadEquipmentDto;
  }

  async createEquipmentsWithProperties(
    equipmentsDto: EquipmentWithNestedProperties[],
    deviceId: string,
  ): Promise<string[]> {
    let returnedProperties: string[] = [];
    for (let equipmentDto of equipmentsDto) {
      let { properties } = equipmentDto;
      let equipment = await this.findOrCreateOne({
        equipmentId: equipmentDto.equipmentId,
        name: equipmentDto.name,
        deviceId: deviceId,
      });

      let createdProperties = await this.propertyService.findManyOrCreate(
        properties,
        deviceId,
        equipment.id,
      );

      returnedProperties = [...returnedProperties, ...createdProperties];
    }

    return returnedProperties;
  }

  async findAll(): Promise<ReadEquipmentDto[]> {
    return await this.equipmentModel.find();
  }
  async findOne(id: string): Promise<ReadEquipmentDto> {
    return await this.equipmentModel.findById(id);
  }
  async update() {}

  async remove(id: string) {
    return await this.equipmentModel.deleteOne({ _id: id });
  }
}
