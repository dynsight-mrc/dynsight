import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceModel } from '../models/device.model';
import { CreateDeviceDto } from '../dtos/create-device.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name) private readonly deviceModel: DeviceModel,
  ) {}

  async create(createDeviceDto: CreateDeviceDto) {
    const device = this.deviceModel.build({
      deviceId: createDeviceDto.deviceId,
      name: createDeviceDto.name,
      orgranizationId: createDeviceDto.orgranizationId,
      siteId: createDeviceDto.siteId,
      status: createDeviceDto.status,
    });

    await device.save();
    return device
  }
  
  async findAll() {
    return await this.deviceModel.find()
  }
  async findOne(id:string) {
    return await this.deviceModel.findById(id)
  }
  async update() {

  }
  async remove(id:string) {
    return await this.deviceModel.deleteOne({_id:id})
  }
}
