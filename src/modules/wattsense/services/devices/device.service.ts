import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceModel } from '../../models/device.model';
import { CreateDeviceDto } from '../../dtos/devices/create-device.dto';
import { ReadDeviceDto } from '../../dtos/devices/read-device.dto';
import { UpdateRoomPropertiesDto } from 'src/modules/room/dtos/update-room-property.dto';


@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name) private readonly deviceModel: DeviceModel
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
    return device;
  }

  async findOrCreateOne(
    updateRoomPropertiesDto: UpdateRoomPropertiesDto,
  ): Promise<ReadDeviceDto> {
    let foundDevice = await this.deviceModel.findOne({
      deviceId: updateRoomPropertiesDto.deviceId,
    });

    if (foundDevice) return foundDevice.toJSON() as undefined as ReadDeviceDto;

    const device = this.deviceModel.build({
      deviceId: updateRoomPropertiesDto.deviceId,
      name: updateRoomPropertiesDto.name,
      orgranizationId: updateRoomPropertiesDto.orgranizationId,
      siteId: updateRoomPropertiesDto.siteId,
      status: updateRoomPropertiesDto.status,
    });
    await device.save();

    return device.toJSON() as ReadDeviceDto;
  }

  async findAll() {
    return await this.deviceModel.findOne();
  }
  async findOne(id: string) {
    return await this.deviceModel.findById(id);
  }
  async update() {
    return true
  }


  async remove(id: string) :Promise<any>{
    return await this.deviceModel.deleteOne({ _id: id });
  }



}
