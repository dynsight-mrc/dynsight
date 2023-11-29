import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Equipment, EquipmentModel } from '../models/equipment.model';
import { CreateEquipmentDto } from '../dtos/create-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectModel(Equipment.name)
    private readonly equipmentModel: EquipmentModel,
  ) {}

  async create(createEuipmentDto: CreateEquipmentDto) {
    const equipment = this.equipmentModel.build({
      deviceId: createEuipmentDto.deviceId,
      equipmentId: createEuipmentDto.equipmentId,
      name: createEuipmentDto.name,
    });

    await equipment.save()
    return equipment
  }
  async findAll() {
    return await this.equipmentModel.find()
  }
  async findOne(id:string) {
    return await this.equipmentModel.findById(id)
  }
  async update() {}
  async remove(id:string) {
    return await this.equipmentModel.deleteOne( {_id:id})
  }
}
